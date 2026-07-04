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

  const { projects, user } = portfolio;
  const displayName = user.fullName ?? user.username;

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black mb-3 text-center">Projets</h1>
        <p className="text-slate-400 text-center mb-12">{displayName}</p>

        {projects.length === 0 ? (
          <p className="text-center text-slate-500 py-20">Aucun projet pour le moment.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} username={params.username} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, username }: { project: Project; username: string }) {
  return (
    <Link
      href={`/u/${username}/projets/${project.id}`}
      className="group flex flex-col bg-[#0a1128] border border-white/10 rounded-2xl overflow-hidden hover:border-blue-700/40 hover:-translate-y-1 transition-all duration-200"
    >
      {project.imageUrl && (
        <div className="relative aspect-video w-full">
          <Image src={project.imageUrl} alt={project.title} fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
        </div>
      )}
      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-semibold text-lg mb-2">{project.title}</h2>
        {project.description && (
          <p className="text-sm text-slate-400 line-clamp-3 mb-4 flex-1">{project.description}</p>
        )}
        {project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.techStack.slice(0, 5).map((tech) => (
              <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-blue-900/40 text-blue-300">
                {tech}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-3 mt-auto">
          {project.liveUrl && (
            <span className="text-xs border border-white/10 rounded-full px-3 py-1 text-slate-300 group-hover:border-blue-700/40 transition-colors">
              Voir →
            </span>
          )}
          {project.githubUrl && (
            <span className="text-xs border border-white/10 rounded-full px-3 py-1 text-slate-400 transition-colors">
              GitHub
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}