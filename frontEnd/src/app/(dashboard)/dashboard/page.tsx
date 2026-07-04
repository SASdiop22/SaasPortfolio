'use client';
import Link from 'next/link';
import { useState } from 'react';
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
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://yourportfolio-create.vercel.app';

function PortfolioUrlBanner({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${APP_URL}/u/${username}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 rounded-xl bg-blue-950/40 border border-blue-700/30 px-5 py-4 mb-8">
      <ExternalLink size={18} className="text-blue-400 shrink-0" />
      <span className="text-sm text-gray-400 shrink-0">Mon portfolio :</span>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-400 hover:text-blue-300 hover:underline truncate flex-1 transition-colors"
      >
        {url}
      </a>
      <button
        onClick={handleCopy}
        className="shrink-0 flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-white/10"
      >
        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
        {copied ? 'Copié !' : 'Copier'}
      </button>
    </div>
  );
}

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
      {user?.username && <PortfolioUrlBanner username={user.username} />}

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