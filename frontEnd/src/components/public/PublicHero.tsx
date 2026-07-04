import Image from 'next/image';
import type { User, SocialLink } from '@/lib/types';

interface Props {
  user: Omit<User, 'email'>;
  socialLinks: SocialLink[];
}

export function PublicHero({ user, socialLinks }: Props) {
  return (
    <section id="hero" className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6 pt-28 pb-20">
      {user.avatarUrl ? (
        <div className="relative w-28 h-28 rounded-full overflow-hidden mb-6 ring-4 ring-white/10">
          <Image
            src={user.avatarUrl}
            alt={user.fullName ?? user.username}
            fill
            className="object-cover"
            sizes="112px"
          />
        </div>
      ) : (
        <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center mb-6 ring-4 ring-white/10">
          <span className="text-4xl font-bold text-white/60 uppercase">
            {(user.fullName ?? user.username).charAt(0)}
          </span>
        </div>
      )}

      <h1 className="text-4xl md:text-5xl font-black mb-3">
        {user.fullName ?? user.username}
      </h1>

      {user.bio && (
        <p className="text-lg text-gray-400 max-w-xl mb-8">{user.bio}</p>
      )}

      {socialLinks.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          {socialLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full border border-white/10 text-sm text-gray-300 hover:text-white hover:border-white/30 transition-colors"
            >
              {link.platform}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}