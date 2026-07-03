import type { Skill } from '@/lib/types';

interface Props {
  skills: Skill[];
}

const LEVEL_COLORS: Record<string, string> = {
  débutant: 'bg-gray-700 text-gray-300',
  intermédiaire: 'bg-blue-900/60 text-blue-300',
  avancé: 'bg-indigo-900/60 text-indigo-300',
  expert: 'bg-purple-900/60 text-purple-300',
  beginner: 'bg-gray-700 text-gray-300',
  intermediate: 'bg-blue-900/60 text-blue-300',
  advanced: 'bg-indigo-900/60 text-indigo-300',
  expert_en: 'bg-purple-900/60 text-purple-300',
};

function levelClass(level: string | null): string {
  if (!level) return 'bg-gray-800 text-gray-400';
  return LEVEL_COLORS[level.toLowerCase()] ?? 'bg-gray-800 text-gray-400';
}

export function PublicSkills({ skills }: Props) {
  if (skills.length === 0) return null;

  // Group by category
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const key = skill.category ?? 'Autres';
    if (!acc[key]) acc[key] = [];
    acc[key].push(skill);
    return acc;
  }, {});

  const categories = Object.keys(grouped);

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Compétences</h2>

      {categories.map((cat) => (
        <div key={cat} className="mb-8">
          {categories.length > 1 && (
            <h3 className="text-lg font-semibold text-gray-300 mb-4 capitalize">
              {cat}
            </h3>
          )}
          <div className="flex flex-wrap gap-2">
            {grouped[cat].map((skill) => (
              <span
                key={skill.id}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-gray-300 hover:text-white hover:border-white/20 transition-colors"
              >
                {skill.name}
                {skill.level && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${levelClass(skill.level)}`}
                  >
                    {skill.level}
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}