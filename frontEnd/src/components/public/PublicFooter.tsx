import Link from 'next/link';
import type { SocialLink, Theme, User } from '@/lib/types';

interface Props {
  username: string;
  user: Omit<User, 'email'>;
  socialLinks: SocialLink[];
  theme?: Theme | null;
}

export function PublicFooter({ username, user, socialLinks, theme }: Props) {
  const base = `/u/${username}`;
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;

  const bg = theme?.backgroundColor ?? '#0a0f1e';
  const text = theme?.textColor ?? '#ffffff';

  const navLinks = [
    { href: base, label: 'Accueil' },
    { href: `${base}/projets`, label: 'Projets' },
    { href: `${base}/competences`, label: 'Compétences' },
    { href: `${base}/parcours`, label: 'Parcours' },
    { href: `${base}/actualites`, label: 'Actualités' },
  ];

  return (
    <footer
      className="border-t py-12"
      style={{ backgroundColor: bg, borderColor: `${text}0D` }}
    >
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-10">
        <div>
          <p className="text-lg font-bold mb-2" style={{ color: text }}>{displayName}</p>
          {user.bio && <p className="text-sm" style={{ color: `${text}60` }}>{user.bio}</p>}
        </div>

        <div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: `${text}60` }}
          >
            Navigation
          </p>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm transition-opacity hover:opacity-100"
                  style={{ color: `${text}80` }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {socialLinks.length > 0 && (
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest mb-4"
              style={{ color: `${text}60` }}
            >
              Réseaux
            </p>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-opacity hover:opacity-100"
                  style={{ color: `${text}80` }}
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className="max-w-6xl mx-auto px-6 mt-10 pt-6 border-t"
        style={{ borderColor: `${text}0D` }}
      >
        <p className="text-xs text-center" style={{ color: `${text}40` }}>
          © {new Date().getFullYear()} {displayName}. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}