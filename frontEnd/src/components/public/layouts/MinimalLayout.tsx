import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, GraduationCap, ArrowRight } from 'lucide-react';
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

export default function MinimalLayout({ username, user, theme, projects, skills, timeline, news, socialLinks }: Props) {
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username;
  const primary = theme?.primaryColor ?? '#1d4ed8';
  const accent = theme?.accentColor ?? '#3b82f6';
  const bg = theme?.backgroundColor ?? '#fafafa';
  const text = theme?.textColor ?? '#0f172a';

  return (
    <div style={{ background: bg, color: text, minHeight: '100vh' }}>
      {/* Hero */}
      <section className="max-w-3xl mx-auto px-8 pt-32 pb-24">
        <div className="flex flex-col md:flex-row md:items-start md:gap-12">
          {user.avatarUrl ? (
            <div className="relative w-24 h-24 shrink-0 mb-8 md:mb-0">
              <Image src={user.avatarUrl} alt={displayName} fill className="object-cover" sizes="96px"
                style={{ borderRadius: '4px' }} />
            </div>
          ) : (
            <div className="w-24 h-24 shrink-0 flex items-center justify-center mb-8 md:mb-0"
              style={{ background: `${primary}15`, borderRadius: '4px' }}>
              <span className="text-3xl font-black uppercase" style={{ color: primary }}>{displayName.charAt(0)}</span>
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-4">
              <span style={{ color: text }}>{user.firstName ?? displayName}</span>
              {user.lastName && (
                <><br /><span style={{ color: primary }}>{user.lastName}</span></>
              )}
            </h1>
            {user.bio && (
              <p className="text-lg leading-relaxed mb-8 max-w-xl" style={{ color: `${text}70` }}>{user.bio}</p>
            )}
            <div className="flex flex-wrap gap-6 items-center">
              <Link href={`/u/${username}/projets`}
                className="inline-flex items-center gap-2 text-sm font-semibold border-b-2 pb-0.5 transition-opacity hover:opacity-70"
                style={{ color: primary, borderColor: primary }}>
                Voir mes projets <ArrowRight size={14} />
              </Link>
              {socialLinks.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="text-sm transition-opacity hover:opacity-70"
                  style={{ color: `${text}60` }}>
                  {link.platform}
                </a>
              ))}
              <ContactModal username={username} ownerName={displayName} />
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-3xl mx-auto px-8" style={{ borderTop: `1px solid ${text}10` }} />

      {/* Projects */}
      {projects.length > 0 && (
        <section className="max-w-3xl mx-auto px-8 py-20">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: `${text}40` }}>Projets</h2>
            <Link href={`/u/${username}/projets`} className="text-xs transition-opacity hover:opacity-70"
              style={{ color: primary }}>Voir tout →</Link>
          </div>
          <ol className="space-y-8">
            {projects.map((p, i) => (
              <li key={p.id} className="flex gap-6 items-start">
                <span className="text-xs pt-1.5 tabular-nums w-5 shrink-0" style={{ color: `${text}30` }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 pb-8" style={{ borderBottom: `1px solid ${text}08` }}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="text-lg font-semibold" style={{ color: text }}>{p.title}</h3>
                    {(p.liveUrl || p.githubUrl) && (
                      <a href={p.liveUrl ?? p.githubUrl ?? ''} target="_blank" rel="noopener noreferrer"
                        className="text-xs shrink-0 transition-opacity hover:opacity-70"
                        style={{ color: accent }}>↗</a>
                    )}
                  </div>
                  {p.description && <p className="text-sm leading-relaxed mb-3" style={{ color: `${text}60` }}>{p.description}</p>}
                  {p.techStack.length > 0 && (
                    <p className="text-xs" style={{ color: `${text}40` }}>{p.techStack.join(' · ')}</p>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="max-w-3xl mx-auto px-8 py-20" style={{ borderTop: `1px solid ${text}10` }}>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] mb-8" style={{ color: `${text}40` }}>Compétences</h2>
          <p className="text-base leading-loose" style={{ color: `${text}70` }}>
            {skills.map((s, i) => (
              <span key={s.id}>
                <span style={{ color: text }}>{s.name}</span>
                {i < skills.length - 1 && <span style={{ color: `${text}30` }}> · </span>}
              </span>
            ))}
          </p>
        </section>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="max-w-3xl mx-auto px-8 py-20" style={{ borderTop: `1px solid ${text}10` }}>
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: `${text}40` }}>Parcours</h2>
            <Link href={`/u/${username}/parcours`} className="text-xs hover:opacity-70" style={{ color: primary }}>Voir tout →</Link>
          </div>
          <div className="space-y-8">
            {timeline.map((item) => (
              <div key={`${item.kind}-${item.data.id}`} className="grid grid-cols-[1fr_auto] gap-4 items-start">
                <div>
                  <p className="font-semibold mb-0.5" style={{ color: text }}>
                    {item.kind === 'experience' ? item.data.role : item.data.degree}
                  </p>
                  <p className="text-sm" style={{ color: `${text}60` }}>
                    {item.kind === 'experience' ? item.data.company : item.data.institution}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {item.kind === 'experience'
                    ? <Briefcase size={12} style={{ color: `${text}30` }} />
                    : <GraduationCap size={12} style={{ color: `${text}30` }} />}
                  <p className="text-xs whitespace-nowrap" style={{ color: `${text}40` }}>
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
        <section className="max-w-3xl mx-auto px-8 py-20" style={{ borderTop: `1px solid ${text}10` }}>
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: `${text}40` }}>Actualités</h2>
            <Link href={`/u/${username}/actualites`} className="text-xs hover:opacity-70" style={{ color: primary }}>Voir tout →</Link>
          </div>
          <ul className="space-y-6">
            {news.map((item) => (
              <li key={item.id} className="flex items-baseline gap-6">
                <time className="text-xs shrink-0 tabular-nums" style={{ color: `${text}40` }}>
                  {item.publishedAt ? formatDay(item.publishedAt) : ''}
                </time>
                <p className="font-medium" style={{ color: text }}>{item.title}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="h-24" />
    </div>
  );
}
