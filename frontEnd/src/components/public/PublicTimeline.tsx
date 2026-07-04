import type { Experience, Education } from '@/lib/types';

type TimelineItem =
  | { type: 'experience'; data: Experience }
  | { type: 'education'; data: Education };

interface Props {
  experiences: Experience[];
  educations: Education[];
}

function formatDate(date: string | null): string {
  if (!date) return 'Présent';
  return new Date(date).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
}

export function PublicTimeline({ experiences, educations }: Props) {
  const items: TimelineItem[] = [
    ...experiences.map((e) => ({ type: 'experience' as const, data: e })),
    ...educations.map((e) => ({ type: 'education' as const, data: e })),
  ].sort(
    (a, b) =>
      new Date(b.data.startDate).getTime() - new Date(a.data.startDate).getTime()
  );

  if (items.length === 0) return null;

  return (
    <section id="parcours" className="py-16 px-6 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Parcours</h2>

      <div className="relative border-l-2 border-white/10 ml-4">
        {items.map((item) => {
          const isExp = item.type === 'experience';
          const data = item.data;
          const title = isExp
            ? (data as Experience).role
            : (data as Education).degree;
          const subtitle = isExp
            ? (data as Experience).company
            : `${(data as Education).institution}${(data as Education).field ? ` — ${(data as Education).field}` : ''}`;
          const description = isExp ? (data as Experience).description : null;

          return (
            <div key={`${item.type}-${data.id}`} className="relative pl-8 pb-10 last:pb-0">
              {/* dot */}
              <div
                className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 ${
                  isExp
                    ? 'bg-blue-600 border-blue-400'
                    : 'bg-purple-600 border-purple-400'
                }`}
              />

              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isExp
                      ? 'bg-blue-900/40 text-blue-300'
                      : 'bg-purple-900/40 text-purple-300'
                  }`}
                >
                  {isExp ? 'Expérience' : 'Formation'}
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(data.startDate)} — {formatDate(data.endDate)}
                </span>
              </div>

              <h3 className="font-semibold text-base">{title}</h3>
              <p className="text-sm text-gray-400 mb-1">{subtitle}</p>
              {description && (
                <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}