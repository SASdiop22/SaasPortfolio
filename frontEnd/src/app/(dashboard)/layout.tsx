'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.replace('/login');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen bg-[#05091a] flex items-center justify-center text-white">
        Chargement…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#05091a]">
      <Sidebar />
      <main className="flex-1 p-8 pt-16 md:pt-8 text-white overflow-auto">{children}</main>
    </div>
  );
}