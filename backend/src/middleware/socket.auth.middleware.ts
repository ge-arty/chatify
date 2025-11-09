import jwt, { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';
import User, { IUser } from '../models/user.model.js';
import { ENV } from '../lib/env.js';

interface CustomSocket extends Socket {
  user?: IUser;
  userId?: string;
}

export const socketAuthMiddleware = async (socket: CustomSocket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.headers.cookie
      ?.split('; ')
      .find((row) => row.startsWith('jwt='))
      ?.split('=')[1];

    if (!token) {
      console.log('Socket connection rejected: No token provided');
      return next(new Error('Unauthorized - No Token Provided'));
    }

    const jwtSecret = ENV.JWT_SECRET;
    if (!jwtSecret) {
      console.log('Socket connection rejected: JWT secret not configured');
      return next(new Error('Server configuration error'));
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decoded.userId) {
      return next(new Error('Invalid token payload'));
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = user;
    socket.userId = user._id.toString();

    next();
  } catch (error) {
    console.error('Socket authentication error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new Error('Invalid token'));
    }
    return next(new Error('Authentication failed'));
  }
};
