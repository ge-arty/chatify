import mongoose from 'mongoose';
import { ENV } from './env.js';

export const connectDB = async () => {
  try {
    const uri = ENV.MONGO_URI;

    if (!uri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    const conn = await mongoose.connect(uri);

    console.log(`mongo db connected ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connection to Mongo Db:`, error);
    process.exit(1); // 1 status code means fail, 0 means success
  }
};
