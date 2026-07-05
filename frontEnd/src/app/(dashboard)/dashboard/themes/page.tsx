'use client';
import { useState, useEffect } from 'react';
import { useThemes, useCreateTheme, useUpdateTheme, useSetActiveTheme } from '@/lib/queries';

const LAYOUTS = [
  { value: 'classic', label: 'Classic', desc: 'Sombre, particules animées, avatar rond' },
  { value: 'minimal', label: 'Minimal', desc: 'Épuré, typographie large, sans animations' },
  { value: 'bold', label: 'Bold', desc: 'Gradient dramatique, sections impactantes' },
] as const;

type LayoutValue = (typeof LAYOUTS)[number]['value'];

type FormState = {
  name: string;
  layout: LayoutValue;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
};

const LAYOUT_DEFAULTS: Record<LayoutValue, Omit<FormState, 'name' | 'layout'>> = {
  classic: { primaryColor: '#1d4ed8', secondaryColor: '#0a1128', backgroundColor: '#05091a', textColor: '#ffffff', accentColor: '#3b82f6' },
  minimal: { primaryColor: '#1d4ed8', secondaryColor: '#e2e8f0', backgroundColor: '#fafafa', textColor: '#0f172a', accentColor: '#3b82f6' },
  bold:    { primaryColor: '#7c3aed', secondaryColor: '#4c1d95', backgroundColor: '#09090b', textColor: '#fafafa', accentColor: '#a78bfa' },
};

const DEFAULT_FORM: FormState = { name: 'Mon thème', layout: 'classic', ...LAYOUT_DEFAULTS.classic };

export default function ThemesPage() {
  const { data: themes = [], isLoading } = useThemes();
  const create = useCreateTheme();
  const update = useUpdateTheme();
  const setActive = useSetActiveTheme();

  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const currentTheme = themes.find((t) => t.isActive) ?? themes[0] ?? null;

  useEffect(() => {
    if (currentTheme) {
      setForm({
        name: currentTheme.name,
        layout: (currentTheme.layout as LayoutValue | null) ?? 'classic',
        primaryColor: currentTheme.primaryColor,
        secondaryColor: currentTheme.secondaryColor,
        backgroundColor: currentTheme.backgroundColor,
        textColor: currentTheme.textColor,
        accentColor: currentTheme.accentColor,
      });
    }
  }, [currentTheme?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    try {
      if (currentTheme) {
        await update.mutateAsync({ id: currentTheme.id, ...form });
        await setActive.mutateAsync(currentTheme.id);
      } else {
        const created = await create.mutateAsync({ ...form });
        await setActive.mutateAsync(created.id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Une erreur est survenue lors de la sauvegarde.');
    }
  };

  if (isLoading) return <div className="text-gray-400">Chargement...</div>;

  const isPending = create.isPending || update.isPending || setActive.isPending;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-8">Personnaliser mon thème</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Layout selector */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Layout</label>
          <div className="grid grid-cols-3 gap-3">
            {LAYOUTS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => {
                  const defaults = LAYOUT_DEFAULTS[l.value];
                  setForm((f) => ({ ...f, layout: l.value, ...defaults }));
                }}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  form.layout === l.value
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-gray-700 hover:border-gray-500'
                }`}
              >
                <p className={`text-sm font-semibold mb-1 ${form.layout === l.value ? 'text-blue-400' : 'text-white'}`}>
                  {l.label}
                </p>
                <p className="text-xs text-gray-500 leading-tight">{l.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">Couleurs</label>
          <div className="grid grid-cols-2 gap-4">
            {(
              [
                { key: 'primaryColor', label: 'Principale' },
                { key: 'secondaryColor', label: 'Secondaire' },
                { key: 'backgroundColor', label: 'Arrière-plan' },
                { key: 'textColor', label: 'Texte' },
                { key: 'accentColor', label: 'Accentuation' },
              ] as { key: keyof FormState; label: string }[]
            ).map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs text-gray-400">{label}</label>
                <input
                  type="color"
                  value={form[key] as string}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="h-10 w-full cursor-pointer rounded-lg border border-gray-700 bg-gray-800 p-1"
                />
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Application...' : 'Appliquer le thème'}
          </button>
          {saved && (
            <span className="text-sm text-green-400">Thème appliqué ✓</span>
          )}
        </div>
      </form>
    </div>
  );
}