import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPortfolio } from '@/lib/public';
import ClassicLayout from '@/components/public/layouts/ClassicLayout';
import MinimalLayout from '@/components/public/layouts/MinimalLayout';
import BoldLayout from '@/components/public/layouts/BoldLayout';
import type { Education, Experience } from '@/lib/types';

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

export default async function PublicHomePage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) notFound();

  const { user, activeTheme, projects, skills, experiences, educations, news, socialLinks } = portfolio;

  const topProjects = [...projects].sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 3);
  const topSkills = [...skills].sort((a, b) => a.displayOrder - b.displayOrder).slice(0, 8);

  const timeline: TimelineEntry[] = [
    ...experiences.map((data) => ({ kind: 'experience' as const, data })),
    ...educations.map((data) => ({ kind: 'education' as const, data })),
  ]
    .sort((a, b) => new Date(b.data.startDate).getTime() - new Date(a.data.startDate).getTime())
    .slice(0, 4);

  const publishedNews = news
    .filter((item) => item.publishedAt !== null)
    .sort((a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime())
    .slice(0, 3);

  const sharedProps = {
    username: params.username,
    user,
    theme: activeTheme,
    projects: topProjects,
    skills: topSkills,
    timeline,
    news: publishedNews,
    socialLinks,
  };

  const layout = activeTheme?.layout ?? 'classic';

  if (layout === 'minimal') return <MinimalLayout {...sharedProps} />;
  if (layout === 'bold') return <BoldLayout {...sharedProps} />;
  return <ClassicLayout {...sharedProps} />;
}