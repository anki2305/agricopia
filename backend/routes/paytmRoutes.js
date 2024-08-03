// routes/paytmRoutes.js
import express from 'express';
import { initiatePayment, verifyPayment } from '../controllers/paytmController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/initiate').post(protect, initiatePayment);
router.route('/verify').post(verifyPayment);

export default router;