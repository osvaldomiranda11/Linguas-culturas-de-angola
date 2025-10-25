// backend/src/index.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize } = require('./models');
const path = require('path');
const fs = require('fs');
const jwtUtils = require('./utils/jwt');
const { Server } = require('socket.io');
const winston = require('winston');
const routes = require('./routes');

dotenv.config();

const PORT = process.env.PORT || 4000;

const logger = winston.createLogger({
  level: 'info',
  transports: [new winston.transports.Console()]
});

const app = express();

app.use(cors({
  origin: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads folder exists
const UPLOAD_DIR = process.env.FILE_STORAGE_PATH || path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOAD_DIR));

// Register routes
app.use('/api', routes);

// Health
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: true }
});

io.use((socket, next) => {
  const token = socket.handshake.auth && socket.handshake.auth.token;
  if (!token) return next();
  try {
    const payload = jwtUtils.verifyToken(token);
    socket.user = payload;
    next();
  } catch (err) {
    logger.warn('Socket auth failed', err.message);
    next();
  }
});

io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id} user:${socket.user ? socket.user.id : 'guest'}`);

  socket.on('private_message', (data) => {
    try {
      const { toUserId, content, type = 'text' } = data;
      if (!toUserId || !content) return;
      // Emit to recipient room
      io.to(`user_${toUserId}`).emit('private_message', {
        from: socket.user || null,
        content,
        type,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      logger.error('private_message error', err);
    }
  });

  if (socket.user && socket.user.id) {
    socket.join(`user_${socket.user.id}`);
  }

  socket.on('join_group', (groupId) => {
    if (!groupId) return;
    socket.join(`group_${groupId}`);
  });

  socket.on('group_message', (data) => {
    const { groupId, content, type = 'text' } = data;
    if (!groupId || !content) return;
    io.to(`group_${groupId}`).emit('group_message', {
      from: socket.user || null,
      content,
      type,
      groupId,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('typing', (payload) => {
    const { toUserId, groupId } = payload;
    if (toUserId) io.to(`user_${toUserId}`).emit('typing', { from: socket.user, typing: true });
    if (groupId) io.to(`group_${groupId}`).emit('typing', { from: socket.user, typing: true });
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Initialize DB and start server
(async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connected (SQLite).');
    // Sync models - in dev we use sync({alter:true})
    await sequelize.sync();
    server.listen(PORT, () => {
      logger.info(`Backend API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', err);
    process.exit(1);
  }
})();
module.exports = { app, server, io };
