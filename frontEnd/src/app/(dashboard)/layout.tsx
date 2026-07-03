'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getMe } from '@/lib/auth';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMe()
      .catch(() => router.replace('/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05091a] flex items-center justify-center text-white">
        Chargement...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#05091a]">
      <Sidebar />
      <main className="flex-1 p-8 text-white overflow-auto">{children}</main>
    </div>
  );
}