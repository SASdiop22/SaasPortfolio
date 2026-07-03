import type { News } from '@/lib/types';

interface Props {
  news: News[];
}

export function PublicNews({ news }: Props) {
  const published = news.filter((n) => n.publishedAt !== null);
  if (published.length === 0) return null;

  return (
    <section className="py-16 px-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-10 text-center">Actualités</h2>
      <div className="flex flex-col gap-4">
        {published.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-4 p-5 rounded-xl border border-white/10 bg-white/5 hover:border-white/20 transition-colors"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-base mb-1">{item.title}</h3>
              <p className="text-sm text-gray-400">
                {new Date(item.publishedAt!).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}