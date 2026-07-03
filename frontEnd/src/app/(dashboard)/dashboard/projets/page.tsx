'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
} from '@/lib/queries';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import FormField from '@/components/ui/FormField';
import type { Project } from '@/lib/types';

type FormState = {
  title: string;
  description: string;
  techStack: string;
  liveUrl: string;
  githubUrl: string;
};

const EMPTY: FormState = { title: '', description: '', techStack: '', liveUrl: '', githubUrl: '' };

const COLUMNS: Column<Project>[] = [
  { key: 'title', label: 'Titre' },
  { key: 'techStack', label: 'Technologies', render: (r) => r.techStack.join(', ') || '—' },
  { key: 'liveUrl', label: 'Live', render: (r) => r.liveUrl ?? '—' },
];

export default function ProjetsPage() {
  const { data = [], isLoading, error } = useProjects();
  const create = useCreateProject();
  const update = useUpdateProject();
  const remove = useDeleteProject();

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState('');

  const openCreate = () => { setForm(EMPTY); setFormError(''); setModal('create'); };
  const openEdit = (row: Project) => {
    setEditing(row);
    setForm({
      title: row.title,
      description: row.description ?? '',
      techStack: row.techStack.join(', '),
      liveUrl: row.liveUrl ?? '',
      githubUrl: row.githubUrl ?? '',
    });
    setFormError('');
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) { setFormError('Le titre est requis.'); return; }
    const payload = {
      title: form.title.trim(),
      description: form.description || null,
      techStack: form.techStack ? form.techStack.split(',').map((s) => s.trim()).filter(Boolean) : [],
      liveUrl: form.liveUrl || null,
      githubUrl: form.githubUrl || null,
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

  const handleDelete = async (row: Project) => {
    if (!confirm(`Supprimer "${row.title}" ?`)) return;
    await remove.mutateAsync(row.id);
  };

  if (isLoading) return <div className="text-gray-400">Chargement...</div>;
  if (error) return <div className="text-red-400">Erreur lors du chargement.</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Projets</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} /> Nouveau
        </button>
      </div>

      <DataTable data={data} columns={COLUMNS} onEdit={openEdit} onDelete={handleDelete} />

      <Modal isOpen={modal !== null} onClose={closeModal} title={modal === 'edit' ? 'Modifier le projet' : 'Nouveau projet'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Titre *" type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Mon projet" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description du projet..." />
          </div>
          <FormField label="Technologies (séparées par des virgules)" type="text" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} placeholder="React, TypeScript, Node.js" />
          <FormField label="URL Live" type="url" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://..." />
          <FormField label="GitHub" type="url" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/..." />
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