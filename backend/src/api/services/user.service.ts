import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { sendWelcomeEmail, sendPasswordResetEmail } from './email.service.js';

const prisma = new PrismaClient();

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    // O 'select' garante que nunca retornamos a senha, mesmo a hash
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return users;
};

export const createUserService = async (userData: any) => {
  if (!userData.email || !userData.password || !userData.name) {
    throw new Error('Name, email, and password are required.');
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    },
  });

  await sendWelcomeEmail(newUser.name, newUser.email);

  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const validateUser = async (email: string, pass: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid credentials.');
  }
  const isPasswordValid = await bcrypt.compare(pass, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials.');
  }
  return user;
};

export const handleForgotPassword = async (email: string) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return;
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + 1);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            passwordResetToken: hashedToken,
            passwordResetExpires: expirationDate,
        },
    });

    await sendPasswordResetEmail(user.email, resetToken);
};

export const handleResetPassword = async (token: string, newPass: string) => {
    if (!token || !newPass) {
        throw new Error('Token and new password are required.');
    }
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await prisma.user.findFirst({
        where: {
            passwordResetToken: hashedToken,
            passwordResetExpires: { gte: new Date() },
        },
    });

    if (!user) {
        throw new Error('Password reset token is invalid or has expired.');
    }

    const hashedPassword = await bcrypt.hash(newPass, 10);

    await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            passwordResetToken: null,
            passwordResetExpires: null,
        },
    });
};

export const getUserById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, createdAt: true },
  });
  if (!user) {
    throw new Error('User not found.');
  }
  return user;
};

export const updateUser = async (id: number, data: any) => {
  if (data.password) {
      delete data.password;
  }
  const updatedUser = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, name: true, createdAt: true },
  });
  return updatedUser;
};

export const deleteUser = async (id: number) => {
  return prisma.user.delete({ where: { id } });
};
