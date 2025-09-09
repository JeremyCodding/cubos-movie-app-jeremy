import api from './api';
import type { RegisterFormData } from '../pages/RegisterPage';
import type { LoginFormData } from '../pages/Login';

export const registerUser = async (userData: Omit<RegisterFormData, 'confirmPassword'>) => {
  const { data } = await api.post('/users/register', userData);
  return data;
};

export const loginUser = async (credentials: LoginFormData) => {
  const { data } = await api.post('/users/login', credentials);
  return data;
};

export const forgotPassword = async (email: string) => {
  const { data } = await api.post('/users/forgot-password', { email });
  return data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const { data } = await api.post('/users/reset-password', { token, newPassword });
  return data;
};