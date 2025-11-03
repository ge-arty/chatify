import express from 'express';
import { login, signUp, logout } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/logout', logout);

export default router;
