// backend/src/routes/messages.js
const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');
const jwtUtils = require('../utils/jwt');
const { io } = require('../..');

router.post('/', jwtUtils.authMiddleware, async (req, res) => {
  try {
    const { receiver_id, group_id, content, type = 'text' } = req.body;
    if (!content || (!receiver_id && !group_id)) return res.status(400).json({ error: 'content and receiver_id or group_id required' });
    const msg = await Message.create({
      sender_id: req.user.id,
      receiver_id: receiver_id || null,
      group_id: group_id || null,
      content,
      type,
      metadata: null
    });
    // Emit socket event
    if (receiver_id) {
      const ioServer = require('socket.io')(0); // dummy - we will use top-level io via exports if needed
    }
    res.json({ message_id: msg.id, status: 'sent', message: msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.get('/', jwtUtils.authMiddleware, async (req, res) => {
  try {
    const { user1, user2, before, limit = 50 } = req.query;
    let where = {};
    if (user1 && user2) {
      where = {
        [Message.sequelize.Op.or]: [
          { sender_id: user1, receiver_id: user2 },
          { sender_id: user2, receiver_id: user1 }
        ]
      };
    } else {
      return res.status(400).json({ error: 'user1 and user2 required' });
    }
    if (before) where.timestamp = { [Message.sequelize.Op.lt]: new Date(before) };
    const messages = await Message.findAll({
      where,
      order: [['timestamp', 'DESC']],
      limit: Math.min(200, parseInt(limit, 10))
    });
    res.json({ messages: messages.reverse() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

module.exports = router;
