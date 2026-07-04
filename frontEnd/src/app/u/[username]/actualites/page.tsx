import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { News } from '@/lib/types';
import { getPortfolio } from '@/lib/public';

interface PageProps {
  params: { username: string };
}

type PublishedNews = News & { publishedAt: string };

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function excerpt(content: string): string {
  return content.length > 150 ? `${content.slice(0, 150)}…` : content;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) return { title: 'Portfolio introuvable' };
  const displayName = portfolio.user.fullName ?? portfolio.user.username;
  return { title: `Actualités — ${displayName}` };
}

function NewsCard({ item, username }: { item: PublishedNews; username: string }) {
  return (
    <Link
      href={`/u/${username}/actualites/${item.id}`}
      className="flex gap-6 p-5 rounded-2xl bg-[#0a1128] border border-white/10 hover:border-white/20 transition-colors cursor-pointer"
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-500 mb-1">{formatDate(item.publishedAt)}</p>
        <h2 className="font-semibold text-base mb-2">{item.title}</h2>
        <p className="text-sm text-slate-400 line-clamp-2">{excerpt(item.content)}</p>
        <p className="text-xs text-blue-400 mt-3">Lire la suite →</p>
      </div>
      {item.imageUrl && (
        <Image
          src={item.imageUrl}
          alt={item.title}
          width={80}
          height={80}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
        />
      )}
    </Link>
  );
}

export default async function ActualitesPage({ params }: PageProps) {
  const portfolio = await getPortfolio(params.username);
  if (!portfolio) notFound();

  const displayName = portfolio.user.fullName ?? portfolio.user.username;

  const publishedNews = portfolio.news
    .filter((n): n is PublishedNews => n.publishedAt !== null)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div className="pt-24 pb-16 px-6 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-5xl font-black mb-4 text-center">Actualités</h1>
      <p className="text-slate-400 text-center mb-16">{displayName}</p>

      {publishedNews.length === 0 ? (
        <p className="text-center text-slate-500">Aucune actualité publiée</p>
      ) : (
        <div className="space-y-4">
          {publishedNews.map((item) => (
            <NewsCard key={item.id} item={item} username={params.username} />
          ))}
        </div>
      )}
    </div>
  );
}