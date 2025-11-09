import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url'; // ✅ Needed for ESM
import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import { ENV } from './lib/env.js';
import { app, server } from './lib/socket.js';

// ✅ Recreate __dirname and __filename for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = ENV.PORT;

// Middleware
app.use(express.json({ limit: '5mb' }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// ✅ Serve frontend in production
if (ENV.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));

  app.get(/^(?!\/api).*/, (_, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

// ✅ Start server + connect to DB
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});
