// F:\Mehnat\BackEnd\routes\authRoutes.js (Example)

import express from 'express';
import { registerUser, loginUser, getProfile } from '../controllers/authController.js'; 
import { protect } from '../middleware/authMiddleware.js'; // Assuming you have a protect middleware

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);

// --- CRITICAL FIX: Add the Protected Profile Route ---
// 1. Use the 'protect' middleware to verify the JWT token
// 2. The getProfile function returns the user data
router.get('/profile', protect, getProfile); 

export default router;