// backend/src/routes/files.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwtUtils = require('../utils/jwt');

const router = express.Router();

const UPLOAD_DIR = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const safe = `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`;
    cb(null, safe);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    // Accept common types
    const allowed = [
      'image/png', 'image/jpeg', 'image/jpg', 'image/gif',
      'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/epub+zip', 'application/zip', 'video/mp4'
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Invalid file type'));
  }
});

router.post('/upload', jwtUtils.authMiddleware, upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required' });
  res.json({
    url: `/uploads/${req.file.filename}`,
    filename: req.file.originalname,
    size: req.file.size,
    mime: req.file.mimetype
  });
});

router.get('/:filename', (req, res) => {
  const filepath = path.join(UPLOAD_DIR, req.params.filename);
  if (!fs.existsSync(filepath)) return res.status(404).send('Not found');
  res.sendFile(filepath);
});

module.exports = router;
