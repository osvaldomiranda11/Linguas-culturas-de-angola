// backend/src/routes/index.js
const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/languages', require('./languages'));
router.use('/translate', require('./translate'));
router.use('/chatbot', require('./chatbot'));
router.use('/messages', require('./messages'));
router.use('/posts', require('./posts'));
router.use('/files', require('./files'));
router.use('/notifications', require('./notifications'));
router.use('/users', require('./users'));

module.exports = router;
