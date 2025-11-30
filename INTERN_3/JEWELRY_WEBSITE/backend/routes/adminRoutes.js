import express from 'express';
import {
  getAnalytics,
  getAllShopkeepers,
  approveShopkeeper,
  toggleShopkeeperSuspension,
  deleteUser,
  getCustomerDetails,
  getAllWishlists,
  getAllReviews,
} from '../controllers/adminController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes are admin-only
router.use(authMiddleware, roleMiddleware(['admin']));

router.get('/analytics', getAnalytics);
router.get('/shopkeepers', getAllShopkeepers);
router.put('/shopkeepers/:id/approve', approveShopkeeper);
router.put('/shopkeepers/:id/suspend', toggleShopkeeperSuspension);
router.delete('/users/:id', deleteUser);
router.get('/customers/:id', getCustomerDetails);
router.get('/wishlists', getAllWishlists);
router.get('/reviews', getAllReviews);

export default router;
