// backend/src/routes/users.js
const express = require('express');
const router = express.Router();
const jwtUtils = require('../utils/jwt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { User } = require('../models');

const UPLOAD_DIR = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g,'_')}`)
});
const upload = multer({ storage });

router.get('/:user_id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.user_id, { attributes: ['id', 'name', 'bio', 'profile_photo', 'languages', 'email', 'phone'] });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const languages = user.languages ? JSON.parse(user.languages) : [];
    res.json({ user: { ...user.toJSON(), languages } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

router.put('/', jwtUtils.authMiddleware, upload.single('profile_photo'), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { name, bio, languages, email, phone, password } = req.body;
    if (name) user.name = name;
    if (bio) user.bio = bio;
    if (languages) {
      try {
        user.languages = Array.isArray(languages) ? JSON.stringify(languages) : JSON.stringify(JSON.parse(languages));
      } catch (e) { user.languages = JSON.stringify([languages]); }
    }
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password_hash = password;
    if (req.file) user.profile_photo = `/uploads/${req.file.filename}`;
    await user.save();
    res.json({ status: 'ok', user: { id: user.id, name: user.name, profile_photo: user.profile_photo } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { q, language } = req.query;
    const where = {};
    if (q) where.name = { [User.sequelize.Op.like]: `%${q}%` };
    if (language) where.languages = { [User.sequelize.Op.like]: `%${language}%` };
    const users = await User.findAll({ where, attributes: ['id', 'name', 'profile_photo', 'bio', 'languages'] , limit: 50});
    const mapped = users.map(u => ({ ...u.toJSON(), languages: u.languages ? JSON.parse(u.languages) : [] }));
    res.json({ users: mapped });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
