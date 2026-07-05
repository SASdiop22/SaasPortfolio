import Link from 'next/link';
import Image from 'next/image';
import { Briefcase, GraduationCap, ExternalLink, Github } from 'lucide-react';
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

export default function BoldLayout({ username, user, theme, projects, skills, timeline, news, socialLinks }: Props) {
  const displayName = user.fullName ?? user.username;
  const primary = theme?.primaryColor ?? '#7c3aed';
  const accent = theme?.accentColor ?? '#a78bfa';
  const bg = theme?.backgroundColor ?? '#09090b';
  const text = theme?.textColor ?? '#fafafa';
  const secondary = theme?.secondaryColor ?? '#4c1d95';

  return (
    <div style={{ background: bg, color: text, minHeight: '100vh' }}>
      {/* Hero — full gradient */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% -10%, ${primary}60, transparent)` }} />
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 60% 50% at 80% 80%, ${secondary}40, transparent)` }} />

        <div className="relative z-10 max-w-6xl mx-auto px-8 py-32 w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-16">
            <div className="flex-1">
              {/* Label */}
              <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8 text-xs font-medium"
                style={{ borderColor: `${accent}40`, color: accent, background: `${accent}10` }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
                Portfolio
              </div>

              <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none mb-6">
                <span style={{ color: text }}>{displayName.split(' ')[0]}</span>
                {displayName.split(' ').length > 1 && (
                  <>
                    <br />
                    <span style={{ WebkitTextStroke: `2px ${accent}`, color: 'transparent' }}>
                      {displayName.split(' ').slice(1).join(' ')}
                    </span>
                  </>
                )}
              </h1>

              {user.bio && (
                <p className="text-xl leading-relaxed max-w-lg mb-10" style={{ color: `${text}80` }}>{user.bio}</p>
              )}

              <div className="flex flex-wrap gap-4 items-center">
                <Link href={`/u/${username}/projets`}
                  className="px-8 py-4 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{ background: `linear-gradient(135deg, ${primary}, ${accent})`, color: text }}>
                  Voir mes projets
                </Link>
                <ContactModal username={username} ownerName={displayName} />
              </div>

              {socialLinks.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-8">
                  {socialLinks.map((link) => (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="text-sm transition-opacity hover:opacity-60"
                      style={{ color: `${text}60` }}>
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            {user.avatarUrl && (
              <div className="shrink-0">
                <div className="relative w-64 h-64 lg:w-80 lg:h-80">
                  <div className="absolute inset-0 rounded-2xl"
                    style={{ background: `linear-gradient(135deg, ${primary}, ${accent})`, transform: 'rotate(6deg)' }} />
                  <div className="relative w-full h-full rounded-2xl overflow-hidden">
                    <Image src={user.avatarUrl} alt={displayName} fill className="object-cover" sizes="320px" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Projects */}
      {projects.length > 0 && (
        <section className="max-w-6xl mx-auto px-8 py-24">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-4xl font-black" style={{ color: text }}>Projets</h2>
            <Link href={`/u/${username}/projets`} className="text-sm font-semibold transition-opacity hover:opacity-70"
              style={{ color: accent }}>Voir tout →</Link>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {projects.map((p, i) => (
              <article key={p.id}
                className={`relative group rounded-2xl p-6 border transition-all hover:scale-[1.02] ${i === 0 ? 'md:col-span-2 md:row-span-1' : ''}`}
                style={{ background: `${text}05`, borderColor: `${text}10` }}>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(135deg, ${primary}10, ${accent}10)` }} />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <h3 className={`font-bold ${i === 0 ? 'text-2xl' : 'text-lg'}`} style={{ color: text }}>{p.title}</h3>
                    <div className="flex gap-2 shrink-0">
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg transition-colors hover:opacity-70"
                          style={{ background: `${text}10`, color: `${text}80` }}>
                          <Github size={14} />
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg transition-colors hover:opacity-70"
                          style={{ background: `${text}10`, color: `${text}80` }}>
                          <ExternalLink size={14} />
                        </a>
                      )}
                    </div>
                  </div>
                  {p.description && <p className="text-sm leading-relaxed mb-4" style={{ color: `${text}70` }}>{p.description}</p>}
                  {p.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {p.techStack.map((t) => (
                        <span key={t} className="text-xs px-2.5 py-1 rounded-lg font-medium"
                          style={{ background: `${accent}15`, color: accent }}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="px-8 py-24" style={{ background: `${text}03` }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="text-4xl font-black" style={{ color: text }}>Compétences</h2>
              <Link href={`/u/${username}/competences`} className="text-sm font-semibold hover:opacity-70" style={{ color: accent }}>Voir tout →</Link>
            </div>
            <div className="flex flex-wrap gap-3">
              {skills.map((s) => (
                <span key={s.id}
                  className="px-5 py-2.5 rounded-full text-sm font-semibold border transition-all hover:scale-105 cursor-default"
                  style={{ borderColor: `${accent}30`, color: text, background: `${accent}08` }}>
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="max-w-6xl mx-auto px-8 py-24">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="text-4xl font-black" style={{ color: text }}>Parcours</h2>
            <Link href={`/u/${username}/parcours`} className="text-sm font-semibold hover:opacity-70" style={{ color: accent }}>Voir tout →</Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {timeline.map((item) => (
              <div key={`${item.kind}-${item.data.id}`}
                className="rounded-2xl p-6 border"
                style={{ background: `${text}05`, borderColor: `${text}10` }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg"
                    style={{ background: item.kind === 'experience' ? `${primary}20` : `${accent}20`, color: item.kind === 'experience' ? primary : accent }}>
                    {item.kind === 'experience' ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                  </div>
                  <span className="text-xs font-medium uppercase tracking-wider" style={{ color: `${text}40` }}>
                    {item.kind === 'experience' ? 'Expérience' : 'Formation'}
                  </span>
                </div>
                <p className="font-bold text-lg mb-1" style={{ color: text }}>
                  {item.kind === 'experience' ? item.data.role : item.data.degree}
                </p>
                <p className="text-sm mb-3" style={{ color: `${text}70` }}>
                  {item.kind === 'experience' ? item.data.company : item.data.institution}
                </p>
                <p className="text-xs" style={{ color: `${text}40` }}>
                  {formatMonth(item.data.startDate)} — {formatMonth(item.data.endDate)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* News */}
      {news.length > 0 && (
        <section className="px-8 py-24" style={{ background: `${text}03` }}>
          <div className="max-w-6xl mx-auto">
            <div className="flex items-baseline justify-between mb-12">
              <h2 className="text-4xl font-black" style={{ color: text }}>Actualités</h2>
              <Link href={`/u/${username}/actualites`} className="text-sm font-semibold hover:opacity-70" style={{ color: accent }}>Voir tout →</Link>
            </div>
            <ul className="space-y-4">
              {news.map((item) => (
                <li key={item.id} className="flex items-center gap-6 rounded-xl p-5 border transition-colors hover:border-opacity-30"
                  style={{ background: `${text}05`, borderColor: `${text}08` }}>
                  <time className="text-xs shrink-0 font-mono" style={{ color: `${text}40` }}>
                    {item.publishedAt ? formatDay(item.publishedAt) : ''}
                  </time>
                  <p className="font-semibold" style={{ color: text }}>{item.title}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <div className="h-24" />
    </div>
  );
}