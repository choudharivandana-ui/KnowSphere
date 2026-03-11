const express  = require('express');
const router   = express.Router();
const path     = require('path');
const fs       = require('fs');
const mongoose = require('mongoose');
const Topic    = require('../models/Topic');

/* ── helpers ────────────────────────────────────────────────────────────── */
const toSlug    = s => s.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
const safeRegex = s => s.replace(/[-[\]{}()*+?.,\\^$|#\s&]/g, '\\$&');
const dbReady   = () => mongoose.connection.readyState === 1;

/* ── load both JSON files and merge ─────────────────────────────────────── */
let JSON_TOPICS = [];
try {
  const slugMap = new Map();

  // Load data.json (53 topics)
  try {
    const raw1 = fs.readFileSync(path.join(__dirname, '..', 'data', 'data.json'), 'utf8');
    const parsed1 = JSON.parse(raw1);
    const topics1 = parsed1.topics || (Array.isArray(parsed1) ? parsed1 : []);
    for (const t of topics1) slugMap.set(t.slug, t);
    console.log('data.json loaded: ' + topics1.length + ' topics');
  } catch (e) { console.warn('data.json missing:', e.message); }

  // Load knowsphere-data.json (overrides duplicates)
  try {
    const raw2 = fs.readFileSync(path.join(__dirname, '..', 'data', 'knowsphere-data.json'), 'utf8');
    const topics2 = JSON.parse(raw2).topics || [];
    for (const t of topics2) slugMap.set(t.slug, t);
    console.log('knowsphere-data.json loaded: ' + topics2.length + ' topics');
  } catch (e) { console.warn('knowsphere-data.json missing:', e.message); }

  JSON_TOPICS = Array.from(slugMap.values());
  console.log('Total merged topics: ' + JSON_TOPICS.length);
} catch (e) {
  console.warn('JSON data load error:', e.message);
}

/* ── search JSON in memory ──────────────────────────────────────────────── */
function findInJson(q, cat) {
  const lq   = q.toLowerCase();
  const lcat = cat ? cat.toLowerCase() : '';
  return JSON_TOPICS.filter(t => {
    const hit =
      (t.topicData?.title   || '').toLowerCase().includes(lq) ||
      (t.query              || '').toLowerCase().includes(lq)  ||
      (t.slug               || '').includes(lq.replace(/\s+/g, '-')) ||
      (t.topicData?.summary || '').toLowerCase().includes(lq);
    const catOk = !lcat || (t.category || '').toLowerCase().includes(lcat);
    return hit && catOk;
  });
}

/* ── save one JSON topic to MongoDB ─────────────────────────────────────── */
async function saveJsonTopicToDB(topic) {
  if (!dbReady()) {
    console.warn(`💾  SKIP "${topic.slug}" — DB not connected`);
    return;
  }
  try {
    // Topic already imported at top
    const exists = await Topic.findOne({ slug: topic.slug }).lean();
    if (exists) {
      console.log(`💾  SKIP "${topic.slug}" — already in DB`);
      return;
    }
    await Topic.create({
      query:       topic.query    || topic.slug,
      slug:        topic.slug,
      category:    topic.category || 'General',
      searchCount: topic.searchCount || 1,
      featured:    topic.featured || false,
      topicData:   topic.topicData,
      comments:    topic.comments || [],
    });
    console.log(`💾  SAVED "${topic.topicData?.title || topic.slug}" ✅`);
  } catch (err) {
    console.error(`💾  SAVE FAILED "${topic.slug}": ${err.message}`);
  }
}

/* ═══════════════════════════════════════════════════════════════════════════
   GET /api/search?q=...&category=...
   1. MongoDB exact slug
   2. MongoDB text + regex
   3. knowsphere-data.json → save each hit to DB
   4. nothing → return empty JSON
═══════════════════════════════════════════════════════════════════════════ */
router.get('/', async (req, res) => {
  try {
    const rawQ   = String(req.query.q        || '').trim();
    const rawCat = String(req.query.category || '').trim();

    if (rawQ.length < 2) {
      return res.status(400).json({ success: false, error: 'Query must be at least 2 characters.' });
    }

    const slug = toSlug(rawQ);
    let topics = [];
    let source = '';

    console.log(`\n🔍  Search: "${rawQ}" | DB: ${dbReady() ? 'connected' : 'NOT connected'}`);

    /* STEP 1 — MongoDB exact slug */
    if (dbReady()) {
      try {
        const exact = await Topic.findOne({ slug }).lean();
        if (exact) {
          await Topic.updateOne({ _id: exact._id }, { $inc: { searchCount: 1 } });
          topics = [exact];
          source = 'db-exact';
          console.log(`🗄️  [DB exact] "${exact.topicData?.title}"`);
        }
      } catch (e) { console.warn('DB exact error:', e.message); }
    }

    /* STEP 2 — MongoDB text + regex */
    if (!topics.length && dbReady()) {
      try {
        const re     = safeRegex(rawQ);
        const filter = {
          $or: [
            { $text: { $search: rawQ } },
            { 'topicData.title': { $regex: re, $options: 'i' } },
            { query:             { $regex: re, $options: 'i' } },
          ],
        };
        if (rawCat) filter.category = { $regex: safeRegex(rawCat), $options: 'i' };
        const rows = await Topic.find(filter).sort({ searchCount: -1 }).limit(10).lean();
        if (rows.length) {
          await Topic.updateMany({ _id: { $in: rows.map(t => t._id) } }, { $inc: { searchCount: 1 } });
          topics = rows;
          source = 'db-search';
          console.log(`🗄️  [DB search] ${rows.length} result(s)`);
        }
      } catch (e) { console.warn('DB search error:', e.message); }
    }

    /* STEP 3 — knowsphere-data.json */
    if (!topics.length) {
      const jsonHits = findInJson(rawQ, rawCat);
      if (jsonHits.length) {
        topics = jsonHits;
        source = 'json';
        console.log(`📄  [JSON] ${jsonHits.length} result(s) — saving to DB…`);
        for (const t of jsonHits) {
          await saveJsonTopicToDB(t);
        }
      }
    }

    if (!topics.length) {
      console.log(`❌  No results for "${rawQ}"`);
      return res.json({ success: true, data: [], total: 0, query: rawQ,
        message: `No results found for "${rawQ}".` });
    }

    console.log(`✅  [${source}] ${topics.length} result(s) for "${rawQ}"\n`);
    return res.json({ success: true, data: topics, total: topics.length, query: rawQ });

  } catch (fatal) {
    console.error('Search fatal:', fatal);
    return res.status(500).json({ success: false, error: fatal.message || 'Server error' });
  }
});

/* ═══════════════════════════════════════════════════════════════════════════
   POST /api/search/save-test
   Body: { "slug": "mumbai" }  — saves that JSON topic to DB
   Use this in Postman to verify DB saving works
═══════════════════════════════════════════════════════════════════════════ */
router.post('/save-test', async (req, res) => {
  try {
    const slug  = String(req.body.slug || '').trim().toLowerCase();
    if (!slug) return res.status(400).json({ success: false, error: 'slug is required' });

    if (!dbReady()) {
      return res.status(503).json({ success: false, error: 'DB not connected', readyState: mongoose.connection.readyState });
    }

    const topic = JSON_TOPICS.find(t => t.slug === slug);
    if (!topic) {
      return res.status(404).json({ success: false, error: `"${slug}" not found in knowsphere-data.json`,
        available: JSON_TOPICS.map(t => t.slug) });
    }

    const exists = await Topic.findOne({ slug }).lean();
    if (exists) {
      return res.json({ success: true, status: 'already_in_db', data: exists });
    }

    const saved = await Topic.create({
      query:       topic.query    || topic.slug,
      slug:        topic.slug,
      category:    topic.category || 'General',
      searchCount: topic.searchCount || 1,
      featured:    topic.featured || false,
      topicData:   topic.topicData,
      comments:    topic.comments || [],
    });

    return res.status(201).json({ success: true, status: 'saved', data: saved });

  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
