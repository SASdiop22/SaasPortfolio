import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getPortfolio } from '@/lib/public';
import type { Project } from '@/lib/types';

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) return { title: 'Introuvable' };
  const name = portfolio.user.fullName ?? portfolio.user.username;
  return { title: `Projets — ${name}` };
}

export default async function ProjetsPage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) notFound();

  const { projects, user, activeTheme } = portfolio;
  const displayName = user.fullName ?? user.username;

  const primary = activeTheme?.primaryColor ?? '#1d4ed8';
  const accent = activeTheme?.accentColor ?? '#3b82f6';
  const secondary = activeTheme?.secondaryColor ?? '#0a1128';
  const text = activeTheme?.textColor ?? '#ffffff';

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black mb-3 text-center">Projets</h1>
        <p className="text-center mb-12" style={{ color: `${text}99` }}>{displayName}</p>

        {projects.length === 0 ? (
          <p className="text-center py-20" style={{ color: `${text}80` }}>Aucun projet pour le moment.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                username={params.username}
                secondary={secondary}
                text={text}
                primary={primary}
                accent={accent}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({
  project,
  username,
  secondary,
  text,
  primary,
  accent,
}: {
  project: Project;
  username: string;
  secondary: string;
  text: string;
  primary: string;
  accent: string;
}) {
  return (
    <Link
      href={`/u/${username}/projets/${project.id}`}
      className="group flex flex-col rounded-2xl overflow-hidden hover:-translate-y-1 transition-all duration-200 border"
      style={{ backgroundColor: secondary, borderColor: `${text}1A` }}
    >
      {project.imageUrl && (
        <div className="relative aspect-video w-full">
          <Image src={project.imageUrl} alt={project.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-semibold text-lg mb-2" style={{ color: text }}>{project.title}</h2>
        {project.description && (
          <p className="text-sm line-clamp-3 mb-4 flex-1" style={{ color: `${text}80` }}>{project.description}</p>
        )}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 5).map((tech) => (
              <span key={tech} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${primary}33`, color: accent }}>
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3 mt-auto">
          {project.liveUrl && (
            <span className="text-xs rounded-full px-3 py-1 border transition-colors" style={{ borderColor: `${text}1A`, color: `${text}CC` }}>
              Voir →
            </span>
          )}
          {project.githubUrl && (
            <span className="text-xs rounded-full px-3 py-1 border transition-colors" style={{ borderColor: `${text}1A`, color: `${text}80` }}>
              GitHub
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}