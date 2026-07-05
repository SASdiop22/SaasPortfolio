'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  useEducations,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
} from '@/lib/queries';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import FormField from '@/components/ui/FormField';
import type { Education } from '@/lib/types';

type FormState = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
};
const EMPTY: FormState = { institution: '', degree: '', field: '', startDate: '', endDate: '' };

const COLUMNS: Column<Education>[] = [
  { key: 'institution', label: 'Établissement' },
  { key: 'degree', label: 'Diplôme' },
  { key: 'field', label: 'Domaine', render: (r) => r.field ?? '—' },
  { key: 'startDate', label: 'Début', render: (r) => r.startDate.slice(0, 10) },
  { key: 'endDate', label: 'Fin', render: (r) => r.endDate ? r.endDate.slice(0, 10) : '—' },
];

export default function FormationPage() {
  const { data = [], isLoading, error } = useEducations();
  const create = useCreateEducation();
  const update = useUpdateEducation();
  const remove = useDeleteEducation();

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Education | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState('');

  const openCreate = () => { setForm(EMPTY); setFormError(''); setModal('create'); };
  const openEdit = (row: Education) => {
    setEditing(row);
    setForm({
      institution: row.institution,
      degree: row.degree,
      field: row.field ?? '',
      startDate: row.startDate.slice(0, 10),
      endDate: row.endDate ? row.endDate.slice(0, 10) : '',
    });
    setFormError('');
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.institution.trim() || !form.degree.trim() || !form.startDate) {
      setFormError('Établissement, diplôme et date de début sont requis.');
      return;
    }
    const payload = {
      institution: form.institution.trim(),
      degree: form.degree.trim(),
      ...(form.field.trim() && { field: form.field.trim() }),
      startDate: form.startDate,
      ...(form.endDate && { endDate: form.endDate }),
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

  const handleDelete = async (row: Education) => {
    if (!confirm(`Supprimer "${row.degree}" ?`)) return;
    await remove.mutateAsync(row.id);
  };

  if (isLoading) return <div className="text-gray-400">Chargement...</div>;
  if (error) return <div className="text-red-400">Erreur lors du chargement.</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Formation</h1>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Nouveau
        </button>
      </div>

      <DataTable data={data} columns={COLUMNS} onEdit={openEdit} onDelete={handleDelete} />

      <Modal isOpen={modal !== null} onClose={closeModal} title={modal === 'edit' ? 'Modifier la formation' : 'Nouvelle formation'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Établissement *" type="text" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} placeholder="Université Paris-Saclay" />
          <FormField label="Diplôme *" type="text" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="Master Informatique" />
          <FormField label="Domaine" type="text" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} placeholder="Génie Logiciel" />
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Date de début *" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            <FormField label="Date de fin (vide = en cours)" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
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