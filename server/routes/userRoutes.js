import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, logoutUser } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', auth, getUserProfile);
router.put('/profile', auth, updateUserProfile);
router.post('/logout', auth, logoutUser);

export default router;
