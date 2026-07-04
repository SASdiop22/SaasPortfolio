import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getPortfolio } from '@/lib/public';

interface PageProps {
  params: { username: string; id: string };
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const portfolio = await getPortfolio(params.username);
  const article = portfolio?.news.find(
    (n) => n.id === Number(params.id) && n.publishedAt !== null,
  );
  if (!article) return { title: 'Actualité introuvable' };
  return { title: `${article.title} — Actualités` };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) notFound();

  const article = portfolio.news.find(
    (n) => n.id === Number(params.id) && n.publishedAt !== null,
  );
  if (!article || article.publishedAt === null) notFound();

  return (
    <main className="pt-24 pb-16 px-6 max-w-3xl mx-auto">
      <Link
        href={`/u/${params.username}/actualites`}
        className="text-sm text-slate-400 hover:text-white transition-colors mb-8 inline-flex items-center gap-1"
      >
        ← Retour aux actualités
      </Link>

      {article.imageUrl && (
        <Image
          src={article.imageUrl}
          alt={article.title}
          width={1280}
          height={720}
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="w-full aspect-video object-cover rounded-2xl mb-8"
        />
      )}

      <p className="text-sm text-slate-500 mb-2">{formatDate(article.publishedAt)}</p>
      <h1 className="text-3xl md:text-4xl font-black mb-8">{article.title}</h1>
      <hr className="border-t border-white/10 mb-8" />
      <p className="text-slate-300 leading-relaxed text-base whitespace-pre-wrap">
        {article.content}
      </p>
    </main>
  );
}