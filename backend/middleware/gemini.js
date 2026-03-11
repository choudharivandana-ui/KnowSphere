const Groq = require('groq-sdk');

let _groq = null;
const responseCache = new Map();
const CACHE_TTL  = 24 * 60 * 60 * 1000;
const ENABLE_AI  = process.env.ENABLE_AI !== 'false';

const getClient = () => {
  if (!ENABLE_AI) throw new Error('AI features disabled (ENABLE_AI=false)');
  if (!process.env.GROQ_API_KEY) throw new Error('GROQ_API_KEY not set in .env');
  if (!_groq) _groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return _groq;
};

const getCacheKey = (type, query) => `${type}:${query.toLowerCase()}`;

function getFromCache(key) {
  const cached = responseCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`✅ Cache hit: ${key}`);
    return cached.data;
  }
  responseCache.delete(key);
  return null;
}

const setCache = (key, data) => responseCache.set(key, { data, timestamp: Date.now() });

function parseJSON(text) {
  if (!text) throw new Error('Empty response from AI');
  let clean = text.replace(/```json\s*/gi, '').replace(/```/gi, '').trim();
  const m = clean.match(/\{[\s\S]*\}/);
  if (!m) throw new Error('No JSON object found in AI response');
  return JSON.parse(m[0]);
}

function makeFallback(query) {
  return {
    title: query.charAt(0).toUpperCase() + query.slice(1),
    subtitle: 'Topic · General',
    image: '',
    type: 'Object',
    country: '',
    state: '',
    founded: '',
    population: 'N/A',
    coordinates: 'N/A',
    languages: [],
    summary: `Information about "${query}". AI generation is temporarily unavailable.`,
    aiInsight: 'AI features are currently unavailable.',
    nameChanges: [{
      name: query,
      period: 'Present',
      era: 'Modern',
      language: 'English',
      meaning: 'Current usage',
      context: 'Current name in use',
      color: '#6366f1',
      source: 'User search',
      current: true
    }],
    historicalContext: [{ period: 'Present', content: `"${query}" is being searched. AI is temporarily unavailable.` }],
    relatedTopics: [],
    quickFacts: [{ label: 'Status', value: 'AI temporarily unavailable' }]
  };
}

async function generateTopicData(query) {
  const cacheKey = getCacheKey('topic', query);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const client = getClient();
    const prompt = `You are a historical knowledge expert. Generate a detailed, factually accurate knowledge panel for: "${query}"

Return ONLY valid JSON (no markdown, no code fences, no additional text) matching this exact structure:

{
  "title": "Official current name",
  "subtitle": "Type · Location/Context",
  "image": "",
  "type": "City|Country|Food|Company|Plant|Gemstone|ScientificTerm|Festival|Event|Object",
  "country": "Primary country or empty string",
  "state": "State/Province or empty string",
  "founded": "Year or period or empty string",
  "population": "Population or N/A",
  "coordinates": "Lat/Long or N/A",
  "languages": ["Language1"],
  "summary": "2-3 sentences of historical significance.",
  "aiInsight": "1-2 sentence AI insight about naming patterns.",
  "nameChanges": [
    { "name": "Historical name", "period": "e.g. 500 BCE", "era": "Ancient|Medieval|Colonial|Modern", "language": "Language", "meaning": "Etymology", "context": "Why used", "color": "#7c3aed", "source": "Historical source", "current": false }
  ],
  "historicalContext": [{ "period": "Period (dates)", "content": "2-3 sentences." }],
  "relatedTopics": [{ "label": "Name", "tag": "Type · Location", "slug": "url-slug" }],
  "quickFacts": [{ "label": "Fact", "value": "Value" }]
}

Rules: nameChanges min 2 (last has current:true), historicalContext 3-5, relatedTopics 3-4, quickFacts 4-6.
Colors sequence: #7c3aed #4f46e5 #0891b2 #059669 #d97706 #16a34a
Return ONLY the JSON object, nothing else.`;

    const message = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2048,
    });

    const raw = message.choices?.[0]?.message?.content;
    if (!raw) throw new Error('Empty response from Groq');

    const data = parseJSON(raw);
    setCache(cacheKey, data);
    console.log(`✅ Groq generated: ${data.title}`);
    return data;

  } catch (err) {
    console.error(`⚠️  Groq error for "${query}":`, err.message);
    const fallback = makeFallback(query);
    setCache(cacheKey, fallback);
    return fallback;
  }
}

async function generateSearchSummary(query, topics) {
  const cacheKey = getCacheKey('summary', query);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const client = getClient();
    const titles = topics.map(t => t.topicData?.title || t.query).join(', ');
    const message = await client.chat.completions.create({
      messages: [{ role: 'user', content: `Summarize search results for "${query}" in 2 sentences. Found: ${titles || 'none'}. Focus on historical naming patterns. Max 60 words. No markdown.` }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 150,
    });
    const summary = message.choices?.[0]?.message?.content?.trim() || '';
    setCache(cacheKey, summary);
    return summary;
  } catch (err) {
    console.error('⚠️  Search summary error:', err.message);
    const fallback = `Found ${topics.length} result(s) for "${query}".`;
    setCache(cacheKey, fallback);
    return fallback;
  }
}

async function generateTopicInsight(title, summary) {
  const cacheKey = getCacheKey('insight', title);
  const cached = getFromCache(cacheKey);
  if (cached) return cached;

  try {
    const client = getClient();
    const message = await client.chat.completions.create({
      messages: [{ role: 'user', content: `In 2 sentences, give a unique AI insight about the naming history of "${title}". Context: ${summary}. Max 50 words. No markdown.` }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 150,
    });
    const insight = message.choices?.[0]?.message?.content?.trim() || '';
    setCache(cacheKey, insight);
    return insight;
  } catch (err) {
    console.error('⚠️  Topic insight error:', err.message);
    const fallback = `AI insights for "${title}" are temporarily unavailable.`;
    setCache(cacheKey, fallback);
    return fallback;
  }
}

module.exports = { generateTopicData, generateSearchSummary, generateTopicInsight };
