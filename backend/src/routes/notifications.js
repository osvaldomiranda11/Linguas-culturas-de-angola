// backend/src/routes/notifications.js
const express = require('express');
const router = express.Router();
const { Notification } = require('../models');
const jwtUtils = require('../utils/jwt');

router.get('/', jwtUtils.authMiddleware, async (req, res) => {
  try {
    const items = await Notification.findAll({ where: { user_id: req.user.id }, order: [['created_at', 'DESC']], limit: 100 });
    res.json({ items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.post('/mark-read', jwtUtils.authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required' });
    await Notification.update({ read: true }, { where: { id: ids, user_id: req.user.id } });
    res.json({ status: 'ok' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to mark read' });
  }
});

module.exports = router;
