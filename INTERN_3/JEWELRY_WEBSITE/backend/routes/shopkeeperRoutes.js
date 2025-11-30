import express from 'express';
import { getShopkeeperAnalytics, getMyReviews } from '../controllers/shopkeeperController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes are shopkeeper-only
router.use(authMiddleware, roleMiddleware(['shopkeeper']));

router.get('/analytics', getShopkeeperAnalytics);
router.get('/reviews', getMyReviews);

export default router;
