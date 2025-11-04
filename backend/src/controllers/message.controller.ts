import { NextFunction, Request, Response } from 'express';
import User from '../models/user.model';
import Message from '../models/message.model';
import cloudinary from '../lib/cloudinary';

export const getAllContacts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log('Error in getAllContacts', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMessagesByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.log('Error in getMessages controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text && !image) {
      return res.status(400).json({ message: 'Text or image is required' });
    }

    if (!senderId) {
      return res.status(400).json({ message: 'Cannot send message to yourself' });
    }

    const receiverExist = await User.exists({ _id: receiverId });

    if (!receiverExist) {
      return res.status(400).json({ message: 'Receiver not found' });
    }

    let imageUrl;

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({ senderId, receiverId, text, image: imageUrl });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    console.log('Error in sendMessage controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getChatPartners = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loggedInUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    });

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString(),
        ),
      ),
    ];

    const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select('-password');

    res.status(200).json(chatPartners);
  } catch (error) {
    console.log('Error in getChatPartners controller:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
