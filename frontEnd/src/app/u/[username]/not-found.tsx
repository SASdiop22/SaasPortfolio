import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#05091a] text-white text-center px-6">
      <h1 className="text-5xl font-black mb-4">404</h1>
      <p className="text-xl text-gray-400 mb-8">Portfolio introuvable</p>
      <Link
        href="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
      >
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}