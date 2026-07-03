'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  FolderOpen,
  Zap,
  Briefcase,
  GraduationCap,
  Newspaper,
  Link2,
  Palette,
  LogOut,
} from 'lucide-react';
import { logout } from '@/lib/auth';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/profil', label: 'Profil', icon: User },
  { href: '/dashboard/projets', label: 'Projets', icon: FolderOpen },
  { href: '/dashboard/competences', label: 'Compétences', icon: Zap },
  { href: '/dashboard/experience', label: 'Expérience', icon: Briefcase },
  { href: '/dashboard/formation', label: 'Formation', icon: GraduationCap },
  { href: '/dashboard/actualites', label: 'Actualités', icon: Newspaper },
  { href: '/dashboard/liens', label: 'Liens', icon: Link2 },
  { href: '/dashboard/themes', label: 'Thèmes', icon: Palette },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      router.replace('/login');
    }
  };

  return (
    <aside className="flex h-screen w-56 flex-col bg-gray-900 border-r border-gray-800 sticky top-0">
      <div className="px-6 py-6 border-b border-gray-800">
        <span className="text-lg font-bold text-white tracking-tight">Portfolio</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === '/dashboard' ? pathname === href : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white',
                  )}
                >
                  <Icon size={16} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}