import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Education, Experience } from '@/lib/types';
import { getPortfolio } from '@/lib/public';

interface PageProps {
  params: { username: string };
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    month: 'short',
    year: 'numeric',
  });
}

function formatRange(startDate: string, endDate: string | null): string {
  return `${formatDate(startDate)} — ${endDate ? formatDate(endDate) : 'Présent'}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) return { title: 'Portfolio introuvable' };
  const displayName = portfolio.user.fullName ?? portfolio.user.username;
  return { title: `Parcours — ${displayName}` };
}

function ExperienceItem({ experience }: { experience: Experience }) {
  return (
    <li className="relative pl-10 pb-10 last:pb-0">
      <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-blue-600 border-blue-400" />
      <p className="text-xs text-slate-500 mb-1">
        {formatRange(experience.startDate, experience.endDate)}
      </p>
      <h3 className="font-semibold text-base">{experience.role}</h3>
      <p className="text-sm text-slate-400">{experience.company}</p>
      {experience.description && (
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{experience.description}</p>
      )}
    </li>
  );
}

function EducationItem({ education }: { education: Education }) {
  return (
    <li className="relative pl-10 pb-10 last:pb-0">
      <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 bg-purple-600 border-purple-400" />
      <p className="text-xs text-slate-500 mb-1">
        {formatRange(education.startDate, education.endDate)}
      </p>
      <h3 className="font-semibold text-base">{education.degree}</h3>
      <p className="text-sm text-slate-400">
        {education.field ? `${education.institution} — ${education.field}` : education.institution}
      </p>
    </li>
  );
}

export default async function ParcoursPage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) notFound();

  const displayName = portfolio.user.fullName ?? portfolio.user.username;

  const experiences = [...portfolio.experiences].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );
  const educations = [...portfolio.educations].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const isEmpty = experiences.length === 0 && educations.length === 0;

  return (
    <div className="pt-24 pb-16 px-6 max-w-3xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black mb-4 text-center">Parcours</h1>
      <p className="text-slate-400 text-center mb-16">{displayName}</p>

      {isEmpty ? (
        <p className="text-center text-slate-500">Aucun parcours renseigné pour le moment.</p>
      ) : (
        <div className="space-y-16">
          {experiences.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
                Expériences
              </h2>
              <ol className="relative border-l-2 border-white/10 ml-4 space-y-0">
                {experiences.map((experience) => (
                  <ExperienceItem key={experience.id} experience={experience} />
                ))}
              </ol>
            </section>
          )}

          {educations.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-6">
                Formations
              </h2>
              <ol className="relative border-l-2 border-white/10 ml-4 space-y-0">
                {educations.map((education) => (
                  <EducationItem key={education.id} education={education} />
                ))}
              </ol>
            </section>
          )}
        </div>
      )}
    </div>
  );
}