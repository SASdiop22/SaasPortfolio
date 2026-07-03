'use client';
import Link from 'next/link';
import { useProfile } from '@/lib/queries';
import {
  FolderOpen,
  Zap,
  Briefcase,
  GraduationCap,
  Newspaper,
  Link2,
  Palette,
  User,
} from 'lucide-react';

const SECTIONS = [
  { href: '/dashboard/profil', label: 'Profil', icon: User, desc: 'Modifier vos informations personnelles' },
  { href: '/dashboard/projets', label: 'Projets', icon: FolderOpen, desc: 'Gérer vos projets' },
  { href: '/dashboard/competences', label: 'Compétences', icon: Zap, desc: 'Gérer vos compétences' },
  { href: '/dashboard/experience', label: 'Expérience', icon: Briefcase, desc: 'Gérer vos expériences' },
  { href: '/dashboard/formation', label: 'Formation', icon: GraduationCap, desc: 'Gérer vos formations' },
  { href: '/dashboard/actualites', label: 'Actualités', icon: Newspaper, desc: 'Gérer vos actualités' },
  { href: '/dashboard/liens', label: 'Liens sociaux', icon: Link2, desc: 'Gérer vos liens sociaux' },
  { href: '/dashboard/themes', label: 'Thèmes', icon: Palette, desc: 'Personnaliser votre portfolio' },
];

export default function DashboardPage() {
  const { data: user, isLoading } = useProfile();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {isLoading ? 'Chargement...' : `Bienvenue, ${user?.username ?? 'utilisateur'} 👋`}
        </h1>
        <p className="mt-2 text-gray-400">
          Gérez votre portfolio depuis ce tableau de bord.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map(({ href, label, icon: Icon, desc }) => (
          <Link
            key={href}
            href={href}
            className="flex flex-col gap-3 rounded-xl bg-gray-900 border border-gray-800 p-6 hover:border-blue-600 hover:bg-gray-800/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-600/20 p-2">
                <Icon size={20} className="text-blue-400" />
              </div>
              <span className="font-semibold text-white">{label}</span>
            </div>
            <p className="text-sm text-gray-400">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}