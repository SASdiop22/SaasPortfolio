import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { PublicPortfolio } from '@/lib/types';
import { PublicHero } from '@/components/public/PublicHero';
import { PublicProjects } from '@/components/public/PublicProjects';
import { PublicSkills } from '@/components/public/PublicSkills';
import { PublicTimeline } from '@/components/public/PublicTimeline';
import { PublicNews } from '@/components/public/PublicNews';

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

async function getPortfolio(username: string): Promise<PublicPortfolio | null> {
  const res = await fetch(`${BASE}/public/u/${username}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data as PublicPortfolio;
}

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) return { title: 'Portfolio introuvable' };
  const name = portfolio.user.fullName ?? portfolio.user.username;
  return {
    title: `${name} — Portfolio`,
    description: portfolio.user.bio ?? `Portfolio de ${portfolio.user.username}`,
  };
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) notFound();

  const { user, activeTheme, projects, skills, experiences, educations, news, socialLinks } =
    portfolio;

  const themeStyle = activeTheme
    ? ({
        '--color-primary': activeTheme.primaryColor,
        '--color-secondary': activeTheme.secondaryColor,
        '--color-bg': activeTheme.backgroundColor,
        '--color-text': activeTheme.textColor,
        '--color-accent': activeTheme.accentColor,
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.textColor,
      } as React.CSSProperties)
    : ({ backgroundColor: '#05091a', color: '#ffffff' } as React.CSSProperties);

  return (
    <div style={themeStyle} className="min-h-screen">
      <PublicHero user={user} socialLinks={socialLinks} />
      <PublicProjects projects={projects} />
      <PublicSkills skills={skills} />
      <PublicTimeline experiences={experiences} educations={educations} />
      <PublicNews news={news} />
    </div>
  );
}