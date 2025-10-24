// backend/src/routes/auth.js
const express = require('express');
const Joi = require('joi');
const { User } = require('../models');
const jwtUtils = require('../utils/jwt');

const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().optional().allow(null, ''),
  phone: Joi.string().optional().allow(null, ''),
  password: Joi.string().min(6).required()
});

router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const { name, email, phone, password } = value;
    if (!email && !phone) return res.status(400).json({ error: 'Either email or phone required' });

    const existing = await User.findOne({ where: { [User.sequelize.Op.or]: [{ email }, { phone }] } });
    if (existing) return res.status(409).json({ error: 'User with provided email or phone already exists' });

    const user = await User.create({
      name,
      email: email || null,
      phone: phone || null,
      password_hash: password
    });
    const token = jwtUtils.signToken({ id: user.id, name: user.name });
    res.json({ status: 'success', user_id: user.id, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

const loginSchema = Joi.object({
  identifier: Joi.string().required(), // email or phone
  password: Joi.string().required()
});

router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });
    const { identifier, password } = value;
    const user = await User.findOne({
      where: {
        [User.sequelize.Op.or]: [
          { email: identifier },
          { phone: identifier }
        ]
      }
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await user.validatePassword(password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwtUtils.signToken({ id: user.id, name: user.name });
    res.json({ status: 'success', token, user: { id: user.id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
