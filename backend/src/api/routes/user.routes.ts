import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
const router = Router();

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Routes for password reset
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);

// Protected routes 
router.get('/', authMiddleware, userController.getAllUsers);
router.get('/profile', authMiddleware, userController.getProfile);
router.patch('/profile', authMiddleware, userController.updateProfile);
router.delete('/profile', authMiddleware, userController.deleteAccount);

export default router;