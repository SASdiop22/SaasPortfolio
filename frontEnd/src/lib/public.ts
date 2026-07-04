import type { PublicPortfolio } from './types';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

export async function getPortfolio(username: string): Promise<PublicPortfolio | null> {
  try {
    const res = await fetch(`${BASE}/public/u/${username}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data as PublicPortfolio;
  } catch {
    return null;
  }
}