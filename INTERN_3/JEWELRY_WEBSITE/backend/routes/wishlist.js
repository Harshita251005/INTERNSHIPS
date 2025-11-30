import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} from '../controllers/wishlistController.js';

const router = express.Router();

router.get('/', authMiddleware, getWishlist);
router.post('/add', authMiddleware, addToWishlist);
router.delete('/:productId', authMiddleware, removeFromWishlist);

export default router;
