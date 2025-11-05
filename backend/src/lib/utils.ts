import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from './env.js';

export const generateToken = (userId: string, res: Response) => {
  const jwtSecret = ENV.JWT_SECRET;
  const nodeEnv = ENV.NODE_ENV;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not defined in environment variables');
  }

  if (!nodeEnv) {
    throw new Error('NODE_ENV is not defined in environment variables');
  }

  const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '7d' });

  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // XXS attacks
    sameSite: 'strict', //CSRF attacks
    secure: nodeEnv === 'development' ? false : true,
  });

  return token;
};
