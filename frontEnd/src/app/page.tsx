const features = [
  {
    title: 'Portfolio public',
    desc: 'Partagez votre profil via /u/votrenom',
    icon: '🌐',
  },
  {
    title: 'Thèmes personnalisés',
    desc: 'Choisissez vos couleurs et votre style',
    icon: '🎨',
  },
  {
    title: 'Gestion complète',
    desc: 'Projets, compétences, expériences, actualités',
    icon: '⚡',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#05091a] text-white">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-5xl font-bold mb-6">
          Votre portfolio professionnel
          <br />
          en quelques minutes
        </h1>
        <p className="text-xl text-gray-400 mb-10 max-w-xl">
          Créez votre portfolio personnalisé, gérez vos projets et compétences,
          partagez votre profil public.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <a
            href="/register"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Commencer gratuitement
          </a>
          <a
            href="/login"
            className="border border-gray-600 hover:border-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Se connecter
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Tout ce dont vous avez besoin
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div key={f.title} className="bg-gray-900 rounded-xl p-6 text-center">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center">
        <h2 className="text-3xl font-bold mb-6">Prêt à vous démarquer ?</h2>
        <a
          href="/register"
          className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-lg font-semibold text-lg transition-colors"
        >
          Créer mon portfolio
        </a>
      </section>
    </main>
  );
}