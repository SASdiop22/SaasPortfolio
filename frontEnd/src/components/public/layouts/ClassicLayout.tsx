import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import { ParticleField } from '@/components/public/ParticleField';
import ContactModal from '@/components/public/ContactModal';
import type { Education, Experience, News, Project, Skill, SocialLink, User, Theme } from '@/lib/types';

type TimelineEntry =
  | { kind: 'experience'; data: Experience }
  | { kind: 'education'; data: Education };

function formatMonth(date: string | null) {
  if (!date) return 'Présent';
  return new Date(date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

function formatDay(date: string) {
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
}

interface Props {
  username: string;
  user: Omit<User, 'email'>;
  theme: Theme | null;
  projects: Project[];
  skills: Skill[];
  timeline: TimelineEntry[];
  news: News[];
  socialLinks: SocialLink[];
}

export default function ClassicLayout({ username, user, theme, projects, skills, timeline, news, socialLinks }: Props) {
  const displayName = user.fullName ?? user.username;
  const primary = theme?.primaryColor ?? '#1d4ed8';
  const accent = theme?.accentColor ?? '#3b82f6';
  const bg = theme?.backgroundColor ?? '#05091a';
  const text = theme?.textColor ?? '#ffffff';

  return (
    <div style={{ '--c-primary': primary, '--c-accent': accent, '--c-bg': bg, '--c-text': text } as React.CSSProperties}>
      {/* Hero */}
      <section className="pt-28 pb-20 relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Suspense fallback={null}><ParticleField /></Suspense>
        </div>
        <div className="relative z-10 flex flex-col items-center">
          {user.avatarUrl ? (
            <div className="relative w-36 h-36 rounded-full overflow-hidden mb-6 ring-4 shadow-lg" style={{ ringColor: accent }}>
              <Image src={user.avatarUrl} alt={displayName} fill className="object-cover" sizes="144px" />
            </div>
          ) : (
            <div className="w-36 h-36 rounded-full flex items-center justify-center mb-6 ring-4" style={{ background: `linear-gradient(135deg, ${primary}, ${accent})` }}>
              <span className="text-5xl font-black uppercase" style={{ color: text }}>{displayName.charAt(0)}</span>
            </div>
          )}
          <h1 className="text-4xl md:text-6xl font-black mb-3" style={{ color: text }}>{displayName}</h1>
          {user.bio && <p className="text-lg max-w-xl mb-8" style={{ color: `${text}99` }}>{user.bio}</p>}
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap gap-3 justify-center mb-10">
              {socialLinks.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border text-sm transition-colors hover:opacity-80"
                  style={{ borderColor: `${text}20`, color: `${text}99` }}>
                  {link.platform}
                </a>
              ))}
            </div>
          )}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href={`/u/${username}/projets`}
              className="px-6 py-3 rounded-full text-sm font-semibold transition-colors hover:opacity-90"
              style={{ background: primary, color: text }}>
              Voir mes projets
            </Link>
            <ContactModal username={username} ownerName={displayName} />
          </div>
        </div>
      </section>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: text }}>Projets</h2>
            <Link href={`/u/${username}/projets`} className="text-sm transition-colors hover:opacity-80" style={{ color: accent }}>Voir tout →</Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((p) => (
              <article key={p.id} className="rounded-xl p-5 border transition-colors hover:border-opacity-60"
                style={{ background: `${text}08`, borderColor: `${text}15` }}>
                <h3 className="text-lg font-semibold mb-2" style={{ color: text }}>{p.title}</h3>
                {p.description && <p className="text-sm line-clamp-2 mb-4" style={{ color: `${text}80` }}>{p.description}</p>}
                {p.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {p.techStack.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded" style={{ background: `${text}15`, color: `${text}99` }}>{t}</span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: text }}>Compétences</h2>
            <Link href={`/u/${username}/competences`} className="text-sm" style={{ color: accent }}>Voir tout →</Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {skills.map((s) => (
              <span key={s.id} className="text-sm px-3 py-1 rounded-full" style={{ background: `${primary}30`, color: accent }}>{s.name}</span>
            ))}
          </div>
        </section>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: text }}>Parcours</h2>
            <Link href={`/u/${username}/parcours`} className="text-sm" style={{ color: accent }}>Voir tout →</Link>
          </div>
          <div className="space-y-6">
            {timeline.map((item) => (
              <div key={`${item.kind}-${item.data.id}`} className="flex items-start gap-4">
                <div className="mt-1 p-2 rounded-lg" style={{ background: `${primary}30`, color: accent }}>
                  {item.kind === 'experience' ? <Briefcase size={18} /> : <GraduationCap size={18} />}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: text }}>
                    {item.kind === 'experience' ? item.data.role : item.data.degree}
                  </p>
                  <p className="text-sm" style={{ color: `${text}80` }}>
                    {item.kind === 'experience' ? item.data.company : item.data.institution}
                  </p>
                  <p className="text-xs mt-1" style={{ color: `${text}60` }}>
                    {formatMonth(item.data.startDate)} — {formatMonth(item.data.endDate)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* News */}
      {news.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold" style={{ color: text }}>Actualités</h2>
            <Link href={`/u/${username}/actualites`} className="text-sm" style={{ color: accent }}>Voir tout →</Link>
          </div>
          <ul className="space-y-4">
            {news.map((item) => (
              <li key={item.id} className="flex items-baseline gap-4 pb-4 last:pb-0" style={{ borderBottom: `1px solid ${text}10` }}>
                <time className="text-xs whitespace-nowrap" style={{ color: `${text}50` }}>
                  {item.publishedAt ? formatDay(item.publishedAt) : ''}
                </time>
                <p className="font-medium" style={{ color: text }}>{item.title}</p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}