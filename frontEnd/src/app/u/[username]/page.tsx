import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Briefcase, GraduationCap } from 'lucide-react';
import { getPortfolio } from '@/lib/public';
import { ParticleField } from '@/components/public/ParticleField';
import ContactModal from '@/components/public/ContactModal';
import type { Education, Experience, News, Project, Skill, SocialLink, User } from '@/lib/types';

interface PageProps {
  params: { username: string };
}

type TimelineEntry =
  | { kind: 'experience'; data: Experience }
  | { kind: 'education'; data: Education };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) return { title: 'Portfolio introuvable' };
  const name = portfolio.user.fullName ?? portfolio.user.username;
  return {
    title: `${name} — Portfolio`,
    description: portfolio.user.bio ?? `Portfolio de ${portfolio.user.username}`,
  };
}

function formatMonth(date: string | null): string {
  if (!date) return 'Présent';
  return new Date(date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

function formatDay(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function SectionHeader({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-baseline justify-between mb-8">
      <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      <Link href={href} className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
        Voir tout →
      </Link>
    </div>
  );
}

function HeroSection(props: {
  username: string;
  user: Omit<User, 'email'>;
  socialLinks: SocialLink[];
}) {
  const { username, user, socialLinks } = props;
  const displayName = user.fullName ?? user.username;
  return (
    <section className="pt-28 pb-20 relative min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      </div>
      <div className="relative z-10 flex flex-col items-center">
        {user.avatarUrl ? (
          <div className="relative w-36 h-36 rounded-full overflow-hidden mb-6 ring-4 ring-blue-500/30 shadow-lg shadow-blue-900/40">
            <Image src={user.avatarUrl} alt={displayName} fill className="object-cover" sizes="144px" />
          </div>
        ) : (
          <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-800 to-blue-950 flex items-center justify-center mb-6 ring-4 ring-blue-500/30">
            <span className="text-5xl font-black text-white/80 uppercase">
              {displayName.charAt(0)}
            </span>
          </div>
        )}
        <h1 className="text-4xl md:text-6xl font-black mb-3">{displayName}</h1>
        {user.bio && <p className="text-lg text-gray-400 max-w-xl mb-8">{user.bio}</p>}
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-10">
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
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href={`/u/${username}/projets`}
            className="px-6 py-3 rounded-full bg-blue-700 hover:bg-blue-600 text-white text-sm font-semibold transition-colors"
          >
            Voir mes projets
          </Link>
          <ContactModal username={username} ownerName={displayName} />
        </div>
      </div>
    </section>
  );
}

function ProjectsPreview({ username, projects }: { username: string; projects: Project[] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <SectionHeader title="Projets" href={`/u/${username}/projets`} />
      <div className="grid gap-6 md:grid-cols-3">
        {projects.map((project) => (
          <article
            key={project.id}
            className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-blue-700/40 transition-colors"
          >
            <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
            {project.description && (
              <p className="text-sm text-gray-400 line-clamp-2 mb-4">{project.description}</p>
            )}
            {project.techStack.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span key={tech} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded">
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function SkillsPreview({ username, skills }: { username: string; skills: Skill[] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <SectionHeader title="Compétences" href={`/u/${username}/competences`} />
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <span key={skill.id} className="bg-blue-900/30 text-blue-300 text-sm px-3 py-1 rounded-full">
            {skill.name}
          </span>
        ))}
      </div>
    </section>
  );
}

function TimelinePreview({ username, items }: { username: string; items: TimelineEntry[] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <SectionHeader title="Parcours" href={`/u/${username}/parcours`} />
      <div className="space-y-6">
        {items.map((item) => (
          <div key={`${item.kind}-${item.data.id}`} className="flex items-start gap-4">
            <div
              className={`mt-1 p-2 rounded-lg ${
                item.kind === 'experience'
                  ? 'bg-blue-900/40 text-blue-300'
                  : 'bg-purple-900/40 text-purple-300'
              }`}
            >
              {item.kind === 'experience' ? <Briefcase size={18} /> : <GraduationCap size={18} />}
            </div>
            <div>
              <p className="font-semibold">
                {item.kind === 'experience' ? item.data.role : item.data.degree}
              </p>
              <p className="text-sm text-gray-400">
                {item.kind === 'experience' ? item.data.company : item.data.institution}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatMonth(item.data.startDate)} — {formatMonth(item.data.endDate)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function NewsPreview({ username, items }: { username: string; items: News[] }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <SectionHeader title="Actualités" href={`/u/${username}/actualites`} />
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-baseline gap-4 border-b border-white/5 pb-4 last:border-0 last:pb-0"
          >
            <time className="text-xs text-gray-500 whitespace-nowrap" dateTime={item.publishedAt ?? undefined}>
              {item.publishedAt ? formatDay(item.publishedAt) : ''}
            </time>
            <p className="font-medium">{item.title}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function PublicHomePage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) notFound();

  const { user, projects, skills, experiences, educations, news, socialLinks } = portfolio;

  const topProjects = [...projects].sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 3);
  const topSkills = [...skills].sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 6);

  const timeline: TimelineEntry[] = [
    ...experiences.map((data) => ({ kind: 'experience' as const, data })),
    ...educations.map((data) => ({ kind: 'education' as const, data })),
  ]
    .sort((a, b) => new Date(b.data.startDate).getTime() - new Date(a.data.startDate).getTime())
    .slice(0, 2);

  const publishedNews = news
    .filter((item) => item.publishedAt !== null)
    .sort(
      (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
    )
    .slice(0, 2);

  return (
    <main>
      <HeroSection username={params.username} user={user} socialLinks={socialLinks} />
      {topProjects.length > 0 && <ProjectsPreview username={params.username} projects={topProjects} />}
      {topSkills.length > 0 && <SkillsPreview username={params.username} skills={topSkills} />}
      {timeline.length > 0 && <TimelinePreview username={params.username} items={timeline} />}
      {publishedNews.length > 0 && <NewsPreview username={params.username} items={publishedNews} />}
    </main>
  );
}