const express = require('express');
const router  = express.Router();
// AI functionality currently disabled; data comes from JSON file only
// const { generateSearchSummary, generateTopicInsight } = require('../middleware/gemini');

router.post('/search-summary', (_req, res) => {
  res.status(503).json({ success: false, error: 'AI features disabled' });
});

router.post('/topic-insight', (_req, res) => {
  res.status(503).json({ success: false, error: 'AI features disabled' });
});

module.exports = router;
