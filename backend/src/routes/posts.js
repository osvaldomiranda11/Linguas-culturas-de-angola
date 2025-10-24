// backend/src/routes/posts.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { Post, User, Comment } = require('../models');
const jwtUtils = require('../utils/jwt');

const UPLOAD_DIR = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', '..', 'uploads');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g,'_')}`)
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

router.post('/', jwtUtils.authMiddleware, upload.array('media', 6), async (req, res) => {
  try {
    const { text, visibility = 'public' } = req.body;
    const media = (req.files || []).map(f => `/uploads/${path.basename(f.path)}`);
    const post = await Post.create({
      author_id: req.user.id,
      text: text || '',
      media: media.length ? JSON.stringify(media) : null,
      visibility
    });
    res.json({ status: 'ok', post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.findAll({ order: [['timestamp', 'DESC']], limit: 50 });
    const result = posts.map(p => {
      return {
        id: p.id,
        author_id: p.author_id,
        text: p.text,
        media: p.media ? JSON.parse(p.media) : [],
        visibility: p.visibility,
        timestamp: p.timestamp
      };
    });
    res.json({ posts: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const comments = await Comment.findAll({ where: { post_id: post.id } });
    res.json({
      post: {
        id: post.id,
        author_id: post.author_id,
        text: post.text,
        media: post.media ? JSON.parse(post.media) : [],
        visibility: post.visibility,
        timestamp: post.timestamp
      },
      comments
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.post('/:id/comments', jwtUtils.authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    const post = await Post.findByPk(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    const comment = await Comment.create({
      author_id: req.user.id,
      post_id: post.id,
      text
    });
    res.json({ status: 'ok', comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to comment' });
  }
});

module.exports = router;
