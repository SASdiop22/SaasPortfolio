'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNews, useCreateNews, useUpdateNews, useDeleteNews } from '@/lib/queries';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import FormField from '@/components/ui/FormField';
import type { News } from '@/lib/types';

type FormState = { title: string; content: string; publishedAt: string };
const EMPTY: FormState = { title: '', content: '', publishedAt: '' };

const COLUMNS: Column<News>[] = [
  { key: 'title', label: 'Titre' },
  { key: 'publishedAt', label: 'Publié le', render: (r) => r.publishedAt ? new Date(r.publishedAt).toLocaleDateString('fr-FR') : '—' },
];

export default function ActualitesPage() {
  const { data = [], isLoading, error } = useNews();
  const create = useCreateNews();
  const update = useUpdateNews();
  const remove = useDeleteNews();

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<News | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState('');

  const openCreate = () => { setForm(EMPTY); setFormError(''); setModal('create'); };
  const openEdit = (row: News) => {
    setEditing(row);
    setForm({
      title: row.title,
      content: row.content,
      publishedAt: row.publishedAt ? row.publishedAt.slice(0, 16) : '',
    });
    setFormError('');
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setFormError('Titre et contenu sont requis.');
      return;
    }
    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      publishedAt: form.publishedAt || null,
    };
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

  const handleDelete = async (row: News) => {
    if (!confirm(`Supprimer "${row.title}" ?`)) return;
    await remove.mutateAsync(row.id);
  };

  if (isLoading) return <div className="text-gray-400">Chargement...</div>;
  if (error) return <div className="text-red-400">Erreur lors du chargement.</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Actualités</h1>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Nouveau
        </button>
      </div>

      <DataTable data={data} columns={COLUMNS} onEdit={openEdit} onDelete={handleDelete} />

      <Modal isOpen={modal !== null} onClose={closeModal} title={modal === 'edit' ? "Modifier l'actualité" : 'Nouvelle actualité'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Titre *" type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Mon actualité" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Contenu *</label>
            <textarea className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={5} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Contenu de l'actualité..." />
          </div>
          <FormField label="Date de publication" type="datetime-local" value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
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