// backend/src/routes/chatbot.js
const express = require('express');
const router = express.Router();
const { ChatbotContent } = require('../models');

function simpleMatch(query, items) {
  const q = query.toLowerCase();
  const ranked = items.map(item => {
    const score = ((item.question || '').toLowerCase().includes(q) ? 2 : 0)
      + ((item.answer || '').toLowerCase().includes(q) ? 1 : 0);
    return { item, score };
  }).filter(r => r.score > 0).sort((a,b)=>b.score-a.score);
  return ranked.map(r => r.item);
}

router.post('/query', async (req, res) => {
  try {
    const { text, language } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });

    const all = await ChatbotContent.findAll();
    const matches = simpleMatch(text, all);
    if (matches.length > 0) {
      const top = matches[0];
      return res.json({
        answer: top.answer,
        category: top.category || 'general',
        source: 'local'
      });
    }

    // fallback: simple educational reply
    const fallback = {
      answer: `Aqui está uma dica: a palavra "${text}" pode ser estudada. Peça exemplos específicos como "como se diz ${text} em Kimbundu?"`,
      category: 'fallback',
      source: 'rule-based'
    };
    res.json(fallback);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Chatbot failed' });
  }
});

router.get('/content', async (req, res) => {
  const items = await ChatbotContent.findAll();
  res.json({ items });
});

module.exports = router;
