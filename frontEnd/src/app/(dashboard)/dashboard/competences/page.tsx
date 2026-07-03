'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '@/lib/queries';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import FormField from '@/components/ui/FormField';
import type { Skill } from '@/lib/types';

type FormState = { name: string; level: string; category: string };
const EMPTY: FormState = { name: '', level: '', category: '' };

const COLUMNS: Column<Skill>[] = [
  { key: 'name', label: 'Nom' },
  { key: 'level', label: 'Niveau', render: (r) => r.level ?? '—' },
  { key: 'category', label: 'Catégorie', render: (r) => r.category ?? '—' },
];

export default function CompetencesPage() {
  const { data = [], isLoading, error } = useSkills();
  const create = useCreateSkill();
  const update = useUpdateSkill();
  const remove = useDeleteSkill();

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState('');

  const openCreate = () => { setForm(EMPTY); setFormError(''); setModal('create'); };
  const openEdit = (row: Skill) => {
    setEditing(row);
    setForm({ name: row.name, level: row.level ?? '', category: row.category ?? '' });
    setFormError('');
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setFormError('Le nom est requis.'); return; }
    const payload = {
      name: form.name.trim(),
      level: form.level || null,
      category: form.category || null,
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

  const handleDelete = async (row: Skill) => {
    if (!confirm(`Supprimer "${row.name}" ?`)) return;
    await remove.mutateAsync(row.id);
  };

  if (isLoading) return <div className="text-gray-400">Chargement...</div>;
  if (error) return <div className="text-red-400">Erreur lors du chargement.</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Compétences</h1>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Nouveau
        </button>
      </div>

      <DataTable data={data} columns={COLUMNS} onEdit={openEdit} onDelete={handleDelete} />

      <Modal isOpen={modal !== null} onClose={closeModal} title={modal === 'edit' ? 'Modifier la compétence' : 'Nouvelle compétence'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Nom *" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="React" />
          <FormField label="Niveau" type="text" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} placeholder="Avancé" />
          <FormField label="Catégorie" type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Frontend" />
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