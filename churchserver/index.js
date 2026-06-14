require('dotenv').config();
const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const http       = require('http');
const { Server } = require('socket.io');
const path       = require('path');

const app    = express();
const server = http.createServer(app); // wrap express with http for Socket.io

// ─── Socket.io setup ─────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Keep last 50 messages in memory so new joiners see recent history
const chatHistory = [];
const MAX_HISTORY = 50;

// Track online viewer count
let viewerCount = 0;

io.on('connection', (socket) => {
  viewerCount++;
  io.emit('viewer_count', viewerCount);

  // Send chat history to the new connection
  socket.emit('chat_history', chatHistory);

  // Receive a message from a client and broadcast to everyone
  socket.on('chat_message', (msg) => {
    const message = {
      id:      'msg-' + Date.now() + Math.random(),
      name:    msg.name    || 'Anonymous',
      text:    msg.text,
      time:    new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isStaff: false,
    };

    chatHistory.push(message);
    if (chatHistory.length > MAX_HISTORY) chatHistory.shift();

    io.emit('chat_message', message); // broadcast to all connected clients
  });

  socket.on('disconnect', () => {
    viewerCount = Math.max(0, viewerCount - 1);
    io.emit('viewer_count', viewerCount);
  });
});

// Export io so routes can emit events if needed
module.exports.io = io;

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/books',       require('./routes/books'));
app.use('/api/content',     require('./routes/content'));
app.use('/api/prayers',     require('./routes/prayers'));
app.use('/api/donations',   require('./routes/donations'));
app.use('/api/projects',    require('./routes/projects'));
app.use('/api/events',      require('./routes/events'));
app.use('/api/stream',      require('./routes/stream'));
app.use('/api/enrollments', require('./routes/enrollments'));
app.use('/api/counseling',  require('./routes/counseling'));
app.use('/api/contact',     require('./routes/contact'));
app.use('/api/volunteers',  require('./routes/volunteers'));
app.use('/api/gallery',     require('./routes/gallery'));
app.use('/api/paystack',    require('./routes/paystack'));

// ─── Health Check ─────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ status: 'Salvation Series API running ✅' }));

// ─── MongoDB + Server start ───────────────────────────────────
const PORT      = process.env.PORT      || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://dami594933:salvation2024@cluster0.rocypvr.mongodb.net/?appName=Cluster0';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
