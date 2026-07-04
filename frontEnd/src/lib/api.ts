import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  if (globalThis.window !== undefined) {
    try {
      const token = await (globalThis as typeof globalThis & { Clerk?: { session?: { getToken: () => Promise<string | null> } } }).Clerk?.session?.getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Clerk not loaded yet — request proceeds without token
    }
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

export default api;