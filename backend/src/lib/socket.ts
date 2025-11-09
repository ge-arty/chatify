import { Server } from 'socket.io';
import http from 'http';
import express from 'express';
import { ENV } from './env.js';
import { socketAuthMiddleware } from '../middleware/socket.auth.middleware.js';

// Initialize express and HTTP server
const app = express();
const server = http.createServer(app);

// Create Socket.IO server with CORS config
const io = new Server(server, {
  cors: { origin: ENV.CLIENT_URL, credentials: true },
});

// Apply authentication middleware
io.use(socketAuthMiddleware);

// Map to store connected users and their socket IDs
const userSocketMap: Record<string, string> = {};

io.on('connection', (socket: any) => {
  if (!socket.user || !socket.userId) {
    console.log('Unauthorized socket, disconnecting...');
    socket.disconnect();
    return;
  }

  console.log(`✅ User connected: ${socket.user.fullName}`);

  const userId: string = socket.userId;
  userSocketMap[userId] = socket.id;

  // Optional: Notify others the user is online
  io.emit('getOnlineUsers', Object.keys(userSocketMap));

  // When the user disconnects
  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.user.fullName}`);
    delete userSocketMap[userId];
    io.emit('getOnlineUsers', { userId });
  });
});

export { io, server, app };
