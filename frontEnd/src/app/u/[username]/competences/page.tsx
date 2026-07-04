import { notFound } from 'next/navigation';
import { getPortfolio } from '@/lib/public';
import type { Skill } from '@/lib/types';

interface PageProps {
  params: { username: string };
}

export async function generateMetadata({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) return { title: 'Introuvable' };
  const name = portfolio.user.fullName ?? portfolio.user.username;
  return { title: `Compétences — ${name}` };
}

const LEVEL_COLORS: Record<string, string> = {
  Expert: 'text-purple-300 bg-purple-900/40',
  Avancé: 'text-green-300 bg-green-900/40',
  Intermédiaire: 'text-yellow-300 bg-yellow-900/40',
  Débutant: 'text-blue-300 bg-blue-900/40',
};

function levelStyle(level: string | null): string {
  if (!level) return '';
  return LEVEL_COLORS[level] ?? 'text-slate-400 bg-white/5';
}

export default async function CompetencesPage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) notFound();

  const { skills, user } = portfolio;
  const displayName = user.fullName ?? user.username;

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const cat = skill.category ?? 'Autres';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const categories = Object.entries(grouped).sort(([a], [b]) =>
    a === 'Autres' ? 1 : b === 'Autres' ? -1 : a.localeCompare(b)
  );

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-5xl font-black mb-3 text-center">Compétences</h1>
        <p className="text-slate-400 text-center mb-16">{displayName}</p>

        {skills.length === 0 ? (
          <p className="text-center text-slate-500 py-20">Aucune compétence pour le moment.</p>
        ) : (
          <div className="space-y-12">
            {categories.map(([category, items]) => (
              <section key={category}>
                <h2 className="text-xl font-semibold mb-5 text-white border-b border-white/10 pb-3">
                  {category}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {items.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0a1128] border border-white/10 text-sm"
                    >
                      <span className="font-medium">{skill.name}</span>
                      {skill.level && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${levelStyle(skill.level)}`}>
                          {skill.level}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}