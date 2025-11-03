import { Request, Response } from 'express';
import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils';
import { sendWelcomeEmail } from '../emails/emailHandlers';
import { ENV } from '../lib/env';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'Email already exists!' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const savedUser = await newUser.save();
      generateToken(savedUser._id.toString(), res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      try {
        const clientUrl = ENV.CLIENT_URL;

        if (!clientUrl) throw new Error("Client url doesn't exist!");

        await sendWelcomeEmail(savedUser.email, savedUser.fullName, clientUrl);
      } catch (error) {
        console.error('Failed to send welcome email:', error);
      }
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in signUp:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid Credentials' });

    generateToken(user._id.toString(), res);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });

    res;
  } catch (error) {
    console.error('Error in login controller:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const logout = async (_: Request, res: Response) => {
  res.cookie('jwt', '', { maxAge: 0 });
  res.status(200).json({ message: 'Logged out successfully ' });
};
