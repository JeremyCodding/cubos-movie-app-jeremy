import type { Request, Response } from 'express';
import * as userService from '../services/user.service.js';
import jwt from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

interface AuthRequest extends Request {
  user?: { userId: number };
}

export const register = async (req: Request, res: Response) => {
  try {
    const user = await userService.createUserService(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(409).json({ message: 'Este e-mail já está cadastrado.' });
    }

    res.status(400).json({ message: 'Could not create user', error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await userService.validateUser(email, password);

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('JWT_SECRET is not defined in the environment variables.');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      secret,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Login successful', token });
  } catch (error: any) {
    res.status(401).json({ message: error.message || 'Invalid credentials' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        await userService.handleForgotPassword(req.body.email);
        res.status(200).json({ message: 'If a user with that email exists, a password reset link has been sent.' });
    } catch (error: any) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: "An internal error occurred." });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token, newPassword } = req.body;
        await userService.handleResetPassword(token, newPassword);
        res.status(200).json({ message: 'Password has been successfully reset.' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ message: 'Falha ao buscar utilizadores', error: error.message });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication error' });
    }

    const userProfile = await userService.getUserById(userId);
    res.status(200).json(userProfile);
  } catch (error: any) {
    res.status(404).json({ message: 'User profile not found' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication error' });
        }

        const updatedData = req.body;
        const updatedUser = await userService.updateUser(userId, updatedData);

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error: any) {
        res.status(400).json({ message: 'Update failed', error: error.message });
    }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication error' });
        }

        await userService.deleteUser(userId);
        res.status(204).send();
    } catch (error: any) {
        res.status(500).json({ message: 'Failed to delete account', error: error.message });
    }
};
