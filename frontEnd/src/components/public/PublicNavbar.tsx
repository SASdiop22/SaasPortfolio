'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  username: string;
  displayName: string;
}

export function PublicNavbar({ username, displayName }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const base = `/u/${username}`;
  const links = [
    { href: base, label: 'Accueil' },
    { href: `${base}/projets`, label: 'Projets' },
    { href: `${base}/competences`, label: 'Compétences' },
    { href: `${base}/parcours`, label: 'Parcours' },
    { href: `${base}/actualites`, label: 'Actualités' },
  ];

  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

  const isActive = (href: string) =>
    href === base ? pathname === base : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/70 border-b border-white/5">
        <nav className="w-full px-4 md:px-8 h-16 flex items-center justify-between">
          <Link href={base} className="text-lg font-bold text-blue-700 tracking-tight">
            {initials}
          </Link>

          <ul className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <li key={link.href} className="relative">
                <Link
                  href={link.href}
                  className={cn(
                    'text-sm transition-colors',
                    isActive(link.href) ? 'text-white' : 'text-slate-400 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
                {isActive(link.href) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-700"
                  />
                )}
              </li>
            ))}
          </ul>

          <button
            className="md:hidden text-slate-400 hover:text-white transition-colors"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-[#05091a]/90 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed inset-y-0 right-0 w-72 bg-[#0a1128] border-l border-white/5 z-50 flex flex-col pt-20 px-8 gap-6"
            >
              <button
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
                onClick={() => setOpen(false)}
                aria-label="Fermer"
              >
                <X size={24} />
              </button>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'text-lg transition-colors',
                    isActive(link.href)
                      ? 'text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}