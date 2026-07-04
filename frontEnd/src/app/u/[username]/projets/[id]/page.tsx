import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPortfolio } from '@/lib/public';

interface PageProps {
  params: { username: string; id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const portfolio = await getPortfolio(params.username);
  const project = portfolio?.projects.find((p) => p.id === Number(params.id));
  if (!project) return { title: 'Projet introuvable' };
  return { title: `${project.title} — Projets` };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) notFound();

  const project = portfolio.projects.find((p) => p.id === Number(params.id));
  if (!project) notFound();

  return (
    <main className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
      <Link
        href={`/u/${params.username}/projets`}
        className="text-sm text-slate-400 hover:text-white transition-colors mb-8 inline-flex items-center gap-1"
      >
        ← Retour aux projets
      </Link>

      {project.imageUrl && (
        <Image
          src={project.imageUrl}
          alt={project.title}
          width={1280}
          height={720}
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          className="w-full aspect-video object-cover rounded-2xl mb-8"
        />
      )}

      <h1 className="text-3xl md:text-4xl font-black mb-4">{project.title}</h1>

      {project.techStack.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {project.techStack.map((tech) => (
            <span
              key={tech}
              className="text-sm px-3 py-1 rounded-full bg-blue-900/40 text-blue-300"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {project.description && (
        <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap mb-8">
          {project.description}
        </p>
      )}

      <div className="flex flex-wrap gap-4">
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-medium text-sm transition-colors bg-blue-700 hover:bg-blue-600 text-white"
          >
            Voir le projet →
          </a>
        )}
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl font-medium text-sm transition-colors border border-white/20 hover:border-white/40 text-slate-300"
          >
            Voir sur GitHub
          </a>
        )}
      </div>
    </main>
  );
}