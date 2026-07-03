'use client';
import { useState } from 'react';
import { Plus, CheckCircle } from 'lucide-react';
import {
  useThemes,
  useCreateTheme,
  useUpdateTheme,
  useDeleteTheme,
  useSetActiveTheme,
} from '@/lib/queries';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import FormField from '@/components/ui/FormField';
import type { Theme } from '@/lib/types';

type FormState = {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
};
const EMPTY: FormState = {
  name: '',
  primaryColor: '#3b82f6',
  secondaryColor: '#1d4ed8',
  backgroundColor: '#05091a',
  textColor: '#ffffff',
  accentColor: '#60a5fa',
};

const COLUMNS: Column<Theme>[] = [
  { key: 'name', label: 'Nom' },
  {
    key: 'primaryColor',
    label: 'Couleur principale',
    render: (r) => (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full border border-gray-600" style={{ backgroundColor: r.primaryColor }} />
        <span>{r.primaryColor}</span>
      </div>
    ),
  },
  {
    key: 'isActive',
    label: 'Statut',
    render: (r) =>
      r.isActive ? (
        <span className="inline-flex items-center gap-1 rounded-full bg-green-900/40 px-2 py-0.5 text-xs text-green-400">
          <CheckCircle size={10} /> Actif
        </span>
      ) : (
        <span className="rounded-full bg-gray-800 px-2 py-0.5 text-xs text-gray-400">Inactif</span>
      ),
  },
];

export default function ThemesPage() {
  const { data = [], isLoading, error } = useThemes();
  const create = useCreateTheme();
  const update = useUpdateTheme();
  const remove = useDeleteTheme();
  const setActive = useSetActiveTheme();

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Theme | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState('');

  const openCreate = () => { setForm(EMPTY); setFormError(''); setModal('create'); };
  const openEdit = (row: Theme) => {
    setEditing(row);
    setForm({
      name: row.name,
      primaryColor: row.primaryColor,
      secondaryColor: row.secondaryColor,
      backgroundColor: row.backgroundColor,
      textColor: row.textColor,
      accentColor: row.accentColor,
    });
    setFormError('');
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Le nom est requis.'); return; }
    try {
      if (modal === 'edit' && editing) {
        await update.mutateAsync({ id: editing.id, ...form });
      } else {
        await create.mutateAsync(form);
      }
      closeModal();
    } catch {
      setFormError('Une erreur est survenue.');
    }
  };

  const handleDelete = async (row: Theme) => {
    if (!confirm(`Supprimer le thème "${row.name}" ?`)) return;
    await remove.mutateAsync(row.id);
  };

  const handleActivate = async (row: Theme) => {
    if (row.isActive) return;
    await setActive.mutateAsync(row.id);
  };

  if (isLoading) return <div className="text-gray-400">Chargement...</div>;
  if (error) return <div className="text-red-400">Erreur lors du chargement.</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Thèmes</h1>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Nouveau
        </button>
      </div>

      <DataTable
        data={data}
        columns={COLUMNS}
        onEdit={openEdit}
        onDelete={handleDelete}
        extraAction={(row) =>
          !row.isActive ? (
            <button
              onClick={() => handleActivate(row)}
              disabled={setActive.isPending}
              className="rounded px-2 py-1 text-xs bg-green-900/40 text-green-400 hover:bg-green-800/60 transition-colors disabled:opacity-50"
            >
              Activer
            </button>
          ) : null
        }
      />

      <Modal isOpen={modal !== null} onClose={closeModal} title={modal === 'edit' ? 'Modifier le thème' : 'Nouveau thème'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Nom *" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mon thème" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300">Couleur principale</label>
              <input type="color" value={form.primaryColor} onChange={(e) => setForm({ ...form, primaryColor: e.target.value })} className="h-9 w-full cursor-pointer rounded-md border border-gray-700 bg-gray-800 p-1" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300">Couleur secondaire</label>
              <input type="color" value={form.secondaryColor} onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })} className="h-9 w-full cursor-pointer rounded-md border border-gray-700 bg-gray-800 p-1" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300">Arrière-plan</label>
              <input type="color" value={form.backgroundColor} onChange={(e) => setForm({ ...form, backgroundColor: e.target.value })} className="h-9 w-full cursor-pointer rounded-md border border-gray-700 bg-gray-800 p-1" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300">Texte</label>
              <input type="color" value={form.textColor} onChange={(e) => setForm({ ...form, textColor: e.target.value })} className="h-9 w-full cursor-pointer rounded-md border border-gray-700 bg-gray-800 p-1" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-300">Accentuation</label>
              <input type="color" value={form.accentColor} onChange={(e) => setForm({ ...form, accentColor: e.target.value })} className="h-9 w-full cursor-pointer rounded-md border border-gray-700 bg-gray-800 p-1" />
            </div>
          </div>
          {formError && <p className="text-sm text-red-400">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={closeModal} className="rounded-md px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors">Annuler</button>
            <button type="submit" disabled={create.isPending || update.isPending} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors">
              {create.isPending || update.isPending ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}