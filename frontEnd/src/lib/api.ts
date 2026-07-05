import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

async function getClerkToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  // Wait up to 5 seconds for Clerk session to be available
  for (let i = 0; i < 50; i++) {
    const clerk = (window as typeof window & { Clerk?: { session?: { getToken: () => Promise<string | null> } } }).Clerk;
    if (clerk?.session) {
      return clerk.session.getToken();
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  return null;
}

api.interceptors.request.use(async (config) => {
  try {
    const token = await getClerkToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {
    // proceed without token
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err),
);

export default api;