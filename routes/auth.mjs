//auth.mjs
import express from 'express';
import authController from '../controllers/authController.mjs';
import { authenticate } from '../middleware/auth.mjs';

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.getProfile);

export default router;