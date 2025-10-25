// backend/src/routes/messages.js
const express = require('express');
const router = express.Router();
const { Message, User } = require('../models');

// 📩 Obter todas as mensagens
router.get('/', async (req, res) => {
  try {
    const messages = await Message.findAll({
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(messages);
  } catch (error) {
    console.error('Erro ao buscar mensagens:', error);
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
});

// 💬 Enviar nova mensagem
router.post('/', async (req, res) => {
  try {
    const { userId, content } = req.body;
    const message = await Message.create({ userId, content });
    res.status(201).json(message);
  } catch (error) {
    console.error('Erro ao criar mensagem:', error);
    res.status(500).json({ error: 'Erro ao criar mensagem' });
  }
});

module.exports = router;
