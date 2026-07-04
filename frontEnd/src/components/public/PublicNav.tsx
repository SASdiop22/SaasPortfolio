'use client';
import { useState, useEffect } from 'react';

interface NavSection {
  id: string;
  label: string;
}

interface Props {
  name: string;
  sections: NavSection[];
}

export function PublicNav({ name, sections }: Props) {
  const [active, setActive] = useState(sections[0]?.id ?? '');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      const scrollY = window.scrollY + 120;
      let current = sections[0]?.id ?? '';
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollY) current = id;
      }
      setActive(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-14">
        <button
          onClick={() => scrollTo('hero')}
          className="font-bold text-white text-sm tracking-wide hover:opacity-80 transition-opacity"
        >
          {name}
        </button>

        <ul className="hidden sm:flex gap-1">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active === id
                    ? 'text-white bg-white/15'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}