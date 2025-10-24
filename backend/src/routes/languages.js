// backend/src/routes/languages.js
const express = require('express');
const router = express.Router();

const LANGS = [
  { code: 'pt', name: 'Português', script: 'Latin', color: '#fdd835' },
  { code: 'kmn', name: 'Kimbundu', script: 'Latin', color: '#2e7d32' },
  { code: 'umb', name: 'Umbundu', script: 'Latin', color: '#0288d1' },
  { code: 'kng', name: 'Kikongo', script: 'Latin', color: '#d32f2f' }
];

router.get('/', (req, res) => {
  res.json({ languages: LANGS });
});

module.exports = router;
