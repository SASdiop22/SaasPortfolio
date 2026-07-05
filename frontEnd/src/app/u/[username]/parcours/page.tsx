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

function ExperienceItem({
  experience,
  primary,
  text,
}: {
  experience: Experience;
  primary: string;
  text: string;
}) {
  return (
    <li className="relative pl-10 pb-10 last:pb-0">
      <span
        className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2"
        style={{ backgroundColor: primary, borderColor: `${primary}CC` }}
      />
      <p className="text-xs mb-1" style={{ color: `${text}60` }}>
        {formatRange(experience.startDate, experience.endDate)}
      </p>
      <h3 className="font-semibold text-base" style={{ color: text }}>{experience.role}</h3>
      <p className="text-sm" style={{ color: `${text}80` }}>{experience.company}</p>
      {experience.description && (
        <p className="text-sm mt-2 leading-relaxed" style={{ color: `${text}60` }}>{experience.description}</p>
      )}
    </li>
  );
}

function EducationItem({
  education,
  accent,
  text,
}: {
  education: Education;
  accent: string;
  text: string;
}) {
  return (
    <li className="relative pl-10 pb-10 last:pb-0">
      <span
        className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2"
        style={{ backgroundColor: accent, borderColor: `${accent}CC` }}
      />
      <p className="text-xs mb-1" style={{ color: `${text}60` }}>
        {formatRange(education.startDate, education.endDate)}
      </p>
      <h3 className="font-semibold text-base" style={{ color: text }}>{education.degree}</h3>
      <p className="text-sm" style={{ color: `${text}80` }}>
        {education.field ? `${education.institution} — ${education.field}` : education.institution}
      </p>
    </li>
  );
}

export default async function ParcoursPage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) notFound();

  const { activeTheme } = portfolio;
  const displayName = portfolio.user.fullName ?? portfolio.user.username;

  const primary = activeTheme?.primaryColor ?? '#1d4ed8';
  const accent = activeTheme?.accentColor ?? '#3b82f6';
  const text = activeTheme?.textColor ?? '#ffffff';

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
      <p className="text-center mb-16" style={{ color: `${text}99` }}>{displayName}</p>

      {isEmpty ? (
        <p className="text-center" style={{ color: `${text}80` }}>Aucun parcours renseigné pour le moment.</p>
      ) : (
        <div className="space-y-16">
          {experiences.length > 0 && (
            <section>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-6"
                style={{ color: `${text}60` }}
              >
                Expériences
              </h2>
              <ol className="relative border-l-2 ml-4 space-y-0" style={{ borderColor: `${text}15` }}>
                {experiences.map((experience) => (
                  <ExperienceItem key={experience.id} experience={experience} primary={primary} text={text} />
                ))}
              </ol>
            </section>
          )}

          {educations.length > 0 && (
            <section>
              <h2
                className="text-xs font-semibold uppercase tracking-widest mb-6"
                style={{ color: `${text}60` }}
              >
                Formations
              </h2>
              <ol className="relative border-l-2 ml-4 space-y-0" style={{ borderColor: `${text}15` }}>
                {educations.map((education) => (
                  <EducationItem key={education.id} education={education} accent={accent} text={text} />
                ))}
              </ol>
            </section>
          )}
        </div>
      )}
    </div>
  );
}