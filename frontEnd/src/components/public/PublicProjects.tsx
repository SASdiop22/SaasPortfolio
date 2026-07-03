import Image from 'next/image';
import { GitBranch, ExternalLink } from 'lucide-react';
import type { Project } from '@/lib/types';

interface Props {
  projects: Project[];
}

export function PublicProjects({ projects }: Props) {
  if (projects.length === 0) return null;

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Projets</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition-colors flex flex-col"
          >
            {project.imageUrl && (
              <div className="relative h-40 overflow-hidden bg-black/20">
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover opacity-80"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}

            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
              {project.description && (
                <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-1">
                  {project.description}
                </p>
              )}

              {project.techStack.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.techStack.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded-full bg-white/10 text-xs text-gray-300"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 5 && (
                    <span className="px-2 py-0.5 text-xs text-gray-500">
                      +{project.techStack.length - 5}
                    </span>
                  )}
                </div>
              )}

              <div className="flex gap-4 mt-auto pt-2">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <GitBranch size={15} />
                    Code
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <ExternalLink size={15} />
                    Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}