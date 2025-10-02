//api.mjs
import express from 'express';
import dataController from '../controllers/dataController.mjs';
import { authenticate } from '../middleware/auth.mjs';

const router = express.Router();

// Protected routes - semua pengguna bisa akses
router.get('/data/latest', authenticate, dataController.getLatestData);
router.get('/data/all', authenticate, dataController.getAllData);
router.get('/data/notifications', authenticate, dataController.getNotifications);

export default router;