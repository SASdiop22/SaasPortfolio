import Link from 'next/link';
import type { SocialLink, User } from '@/lib/types';

interface Props {
  username: string;
  user: Omit<User, 'email'>;
  socialLinks: SocialLink[];
}

export function PublicFooter({ username, user, socialLinks }: Props) {
  const base = `/u/${username}`;
  const displayName = user.fullName ?? user.username;

  const navLinks = [
    { href: base, label: 'Accueil' },
    { href: `${base}/projets`, label: 'Projets' },
    { href: `${base}/competences`, label: 'Compétences' },
    { href: `${base}/parcours`, label: 'Parcours' },
    { href: `${base}/actualites`, label: 'Actualités' },
  ];

  return (
    <footer className="bg-[#0a0f1e] border-t border-white/5 py-12">
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div>
          <p className="text-lg font-bold text-white mb-2">{displayName}</p>
          {user.bio && <p className="text-slate-500 text-sm">{user.bio}</p>}
        </div>

        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
            Navigation
          </p>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-slate-400 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {socialLinks.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">
              Réseaux
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t border-white/5">
        <p className="text-xs text-slate-600 text-center">
          © {new Date().getFullYear()} {displayName}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}