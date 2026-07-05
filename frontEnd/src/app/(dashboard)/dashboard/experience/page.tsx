'use client';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  useExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from '@/lib/queries';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import Modal from '@/components/dashboard/Modal';
import FormField from '@/components/ui/FormField';
import type { Experience } from '@/lib/types';

type FormState = {
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string;
};
const EMPTY: FormState = { company: '', role: '', description: '', startDate: '', endDate: '' };

const COLUMNS: Column<Experience>[] = [
  { key: 'company', label: 'Entreprise' },
  { key: 'role', label: 'Poste' },
  { key: 'startDate', label: 'Début', render: (r) => r.startDate.slice(0, 10) },
  { key: 'endDate', label: 'Fin', render: (r) => r.endDate ? r.endDate.slice(0, 10) : 'Présent' },
];

export default function ExperiencePage() {
  const { data = [], isLoading, error } = useExperiences();
  const create = useCreateExperience();
  const update = useUpdateExperience();
  const remove = useDeleteExperience();

  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [formError, setFormError] = useState('');

  const openCreate = () => { setForm(EMPTY); setFormError(''); setModal('create'); };
  const openEdit = (row: Experience) => {
    setEditing(row);
    setForm({
      company: row.company,
      role: row.role,
      description: row.description ?? '',
      startDate: row.startDate.slice(0, 10),
      endDate: row.endDate ? row.endDate.slice(0, 10) : '',
    });
    setFormError('');
    setModal('edit');
  };
  const closeModal = () => { setModal(null); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company.trim() || !form.role.trim() || !form.startDate) {
      setFormError('Entreprise, poste et date de début sont requis.');
      return;
    }
    const payload = {
      company: form.company.trim(),
      role: form.role.trim(),
      ...(form.description.trim() && { description: form.description.trim() }),
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

  const handleDelete = async (row: Experience) => {
    if (!confirm(`Supprimer l'expérience chez "${row.company}" ?`)) return;
    await remove.mutateAsync(row.id);
  };

  if (isLoading) return <div className="text-gray-400">Chargement...</div>;
  if (error) return <div className="text-red-400">Erreur lors du chargement.</div>;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Expérience</h1>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          <Plus size={16} /> Nouveau
        </button>
      </div>

      <DataTable data={data} columns={COLUMNS} onEdit={openEdit} onDelete={handleDelete} />

      <Modal isOpen={modal !== null} onClose={closeModal} title={modal === 'edit' ? "Modifier l'expérience" : 'Nouvelle expérience'}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField label="Entreprise *" type="text" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="ACME Corp" />
          <FormField label="Poste *" type="text" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Développeur Full-Stack" />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <textarea className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description du poste..." />
          </div>
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