import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { ENV } from '../lib/env.js';
import User, { IUser } from '../models/user.model.js';

declare global {
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

interface JwtPayload {
  userId: string;
}

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - No token provided' });
    }

    const jwtSecret = ENV.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in protectRoute middleware:', error);
    return res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};
