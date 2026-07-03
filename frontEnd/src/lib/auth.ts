import api from './api';
import { ApiResponse, User } from './types';

export async function login(
  email: string,
  password: string,
): Promise<{ id: number; username: string }> {
  const res = await api.post<ApiResponse<{ id: number; username: string }>>(
    '/api/auth/login',
    { email, password },
  );
  return res.data.data;
}

export async function register(data: {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}): Promise<{ id: number; username: string }> {
  const res = await api.post<ApiResponse<{ id: number; username: string }>>(
    '/api/auth/register',
    data,
  );
  return res.data.data;
}

export async function logout(): Promise<void> {
  await api.post('/api/auth/logout');
}

export async function getMe(): Promise<User> {
  const res = await api.get<ApiResponse<User>>('/api/me');
  return res.data.data;
}