const express = require('express');
const router  = express.Router();
const { join } = require('path');
const fs = require('fs');

/* =========================================================
   DATA FILES
   ========================================================= */

const dataFile   = join(__dirname, '..', 'data', 'data.json');
const extraFile  = join(__dirname, '..', 'data', 'knowsphere-data.json');

/* =========================================================
   LOAD TOPICS FROM JSON
   ========================================================= */

function loadTopics() {
  try {
    const raw   = fs.readFileSync(dataFile, 'utf8');
    const clean = raw.split('\n').filter(line => !line.trim().startsWith('//')).join('\n');
    return JSON.parse(clean).topics || [];
  } catch (err) {
    console.error('Failed to load data.json:', err.message);
    return [];
  }
}

function loadExtraTopics() {
  try {
    const raw = fs.readFileSync(extraFile, 'utf8');
    return JSON.parse(raw).topics || [];
  } catch (err) {
    console.warn('knowsphere-data.json not loaded:', err.message);
    return [];
  }
}

/* Merge both files — data.json wins on duplicate slugs */
function buildTopicsList() {
  const main  = loadTopics();
  const extra = loadExtraTopics();
  const slugsSeen = new Set(main.map(t => t.slug));
  const merged = [...main];
  for (const t of extra) {
    if (!slugsSeen.has(t.slug)) merged.push(t);
  }
  return merged;
}

let topicsData = buildTopicsList();
console.log(`✅  topics loaded: ${topicsData.length} (data.json + knowsphere-data.json)`);

/* =========================================================
   HELPERS
   ========================================================= */

const safeRegex = s => s.replace(/[-[\]{}()*+?.,\\^$|#\s&]/g, '\\$&');

function findTopicBySlug(slug) {
  if (!slug) return null;
  return topicsData.find(t => t.slug && t.slug.toLowerCase() === slug.toLowerCase());
}

/* =========================================================
   GET FEATURED TOPICS   /api/topics/featured
   ========================================================= */

router.get('/featured', (_req, res) => {
  try {
    const data = topicsData
      .filter(t => t.featured)
      .sort((a, b) => (b.searchCount || 0) - (a.searchCount || 0))
      .slice(0, 3);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/* =========================================================
   GET TRENDING TOPICS   /api/topics/trending
   ========================================================= */

router.get('/trending', (_req, res) => {
  try {
    const data = topicsData
      .slice()
      .sort((a, b) => (b.searchCount || 0) - (a.searchCount || 0))
      .slice(0, 8);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/* =========================================================
   GET TOPICS BY CATEGORY   /api/topics/category/:name
   ========================================================= */

router.get('/category/:name', (req, res) => {
  try {
    const regex = new RegExp(safeRegex(req.params.name), 'i');
    const data  = topicsData
      .filter(t => regex.test(t.category))
      .sort((a, b) => (b.searchCount || 0) - (a.searchCount || 0))
      .slice(0, 20);
    res.json({ success: true, data });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/* =========================================================
   GET SINGLE TOPIC BY SLUG   /api/topics/:slug
   ========================================================= */

/* =========================================================
   GET RELATED TOPICS BY SLUGS
   /api/topics/related?slugs=slug1,slug2,slug3
   ========================================================= */

router.get('/related', (req, res) => {
  try {
    const slugs = String(req.query.slugs || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    if (!slugs.length) {
      return res.status(400).json({ success: false, error: 'slugs param required' });
    }

    const results = slugs
      .map(slug => {
        const topic = topicsData.find(t => t.slug === slug);
        if (!topic) return null;
        return {
          slug:     topic.slug,
          category: topic.category,
          title:    topic.topicData?.title    || topic.slug,
          subtitle: topic.topicData?.subtitle || '',
          type:     topic.topicData?.type     || '',
          image:    topic.topicData?.image    || '',
        };
      })
      .filter(Boolean);

    res.json({ success: true, data: results });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/* =========================================================
   GET SINGLE TOPIC BY SLUG
   ========================================================= */

router.get('/:slug', (req, res) => {
  try {
    const topic = findTopicBySlug(req.params.slug);
    if (!topic) {
      return res.status(404).json({ success: false, error: 'Topic not found' });
    }
    topic.searchCount = (topic.searchCount || 0) + 1;
    res.json({ success: true, data: topic });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/* =========================================================
   ADD COMMENT   /api/topics/:slug/comments
   ========================================================= */

router.post('/:slug/comments', (req, res) => {
  try {
    const { author = 'Anonymous', avatar = 'AN', text, rating = 5 } = req.body;
    if (!text?.trim()) {
      return res.status(400).json({ success: false, error: 'Comment text is required' });
    }
    const topic = findTopicBySlug(req.params.slug);
    if (!topic) {
      return res.status(404).json({ success: false, error: 'Topic not found' });
    }
    if (!topic.comments) topic.comments = [];
    const newComment = {
      _id: Date.now().toString(),
      author, avatar,
      text: text.trim(),
      rating, likes: 0,
      createdAt: new Date()
    };
    topic.comments.unshift(newComment);
    res.status(201).json({ success: true, data: newComment });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

/* =========================================================
   LIKE COMMENT   /api/topics/:slug/comments/:id/like
   ========================================================= */

router.post('/:slug/comments/:id/like', (req, res) => {
  try {
    const topic = findTopicBySlug(req.params.slug);
    if (!topic) {
      return res.status(404).json({ success: false, error: 'Topic not found' });
    }
    const comment = topic.comments?.find(c => c._id === req.params.id);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }
    comment.likes = (comment.likes || 0) + 1;
    res.json({ success: true, data: { likes: comment.likes } });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
