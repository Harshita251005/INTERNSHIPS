import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  createReview,
  getProductReviews,
  deleteReview,
} from '../controllers/reviewController.js';

const router = express.Router();

router.route('/:productId')
  .get(getProductReviews)
  .post(authMiddleware, createReview);

router.delete('/:id', authMiddleware, deleteReview);

export default router;
