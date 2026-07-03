'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  useSocialLinks,
  useCreateSocialLink,
  useUpdateSocialLink,
  useDeleteSocialLink,
} from '@/lib/queries';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import FormField from '@/components/ui/FormField';
import type { SocialLink } from '@/lib/types';

type FormState = { platform: string; url: string };
const EMPTY: FormState = { platform: '', url: '' };

const COLUMNS: Column<SocialLink>[] = [
  { key: 'platform', label: 'Plateforme' },
  { key: 'url', label: 'URL', render: (r) => (
    <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline truncate max-w-xs block">
      {r.url}
    </a>
  )},
];

export default function LiensPage() {
  const { data = [], isLoading, error } = useSocialLinks();
  const create = useCreateSocialLink();
  const update = useUpdateSocialLink();
  const remove = useDeleteSocialLink();

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState('');

  const openCreate = () => { setForm(EMPTY); setFormError(''); setModal('create'); };
  const openEdit = (row: SocialLink) => {
    setEditing(row);
    setForm({ platform: row.platform, url: row.url });
    setFormError('');
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.platform.trim() || !form.url.trim()) {
      setFormError('Plateforme et URL sont requis.');
      return;
    }
    const payload = { platform: form.platform.trim(), url: form.url.trim() };
    try {
      if (modal === 'edit' && editing) {
        await update.mutateAsync({ id: editing.id, ...payload });
      } else {
        await create.mutateAsync(payload);
      }
      closeModal();
    } catch {
      setFormError('Une erreur est survenue.');
    }
  };

  const handleDelete = async (row: SocialLink) => {
    if (!confirm(`Supprimer le lien "${row.platform}" ?`)) return;
    await remove.mutateAsync(row.id);
  };

  if (isLoading) return <div className="text-gray-400">Chargement...</div>;
  if (error) return <div className="text-red-400">Erreur lors du chargement.</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Liens sociaux</h1>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Nouveau
        </button>
      </div>

      <DataTable data={data} columns={COLUMNS} onEdit={openEdit} onDelete={handleDelete} />

      <Modal isOpen={modal !== null} onClose={closeModal} title={modal === 'edit' ? 'Modifier le lien' : 'Nouveau lien'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Plateforme *" type="text" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} placeholder="GitHub, LinkedIn, Twitter..." />
          <FormField label="URL *" type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
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