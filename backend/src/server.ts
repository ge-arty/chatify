import express from 'express';
import dotenv from 'dotenv';
import path from 'path';

import authRoutes from './routes/auth.route';
import messageRoutes from './routes/message.route';
import { connectDB } from './lib/db';
import { ENV } from './lib/env';
import cookieParser from 'cookie-parser';

const app = express();

const PORT = ENV.PORT;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// make ready for deployment
if (ENV.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../frontend/dist')));

  app.get(/^(?!\/api).*/, (_, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}
app.listen(PORT, () => {
  (console.log(`server running on port ${PORT}`), connectDB());
});
