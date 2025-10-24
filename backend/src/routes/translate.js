// backend/src/routes/translate.js
const express = require('express');
const router = express.Router();
const TranslateEngine = require('../utils/translateEngine');
const { Translation } = require('../models');

router.post('/', async (req, res) => {
  try {
    const { text, from_lang, to_lang } = req.body;
    if (!text || !from_lang || !to_lang) return res.status(400).json({ error: 'text, from_lang and to_lang required' });

    // Check cache
    const cached = await Translation.lookup(from_lang, to_lang, text);
    if (cached) {
      return res.json({ translation: cached.translated_text, cached: true });
    }

    const result = TranslateEngine.translate(text, from_lang, to_lang);
    // save cache
    await Translation.create({
      source_lang: from_lang,
      target_lang: to_lang,
      source_text: text,
      translated_text: result.translatedText
    });

    res.json({ translation: result.translatedText, cached: false, confidence: result.confidence });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Translation failed' });
  }
});

module.exports = router;
