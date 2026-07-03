'use client';
import { Pencil, Trash2 } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  onEdit: (row: T) => void;
  onDelete: (row: T) => void;
  extraAction?: (row: T) => React.ReactNode;
}

export default function DataTable<T extends { id: number }>({
  data,
  columns,
  onEdit,
  onDelete,
  extraAction,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-xl bg-gray-900 p-8 text-center text-gray-400">
        Aucun élément pour l&apos;instant.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-gray-900">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-800">
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
              >
                {col.label}
              </th>
            ))}
            <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3 text-gray-300">
                  {col.render
                    ? col.render(row)
                    : String((row as Record<string, unknown>)[col.key as string] ?? '—')}
                </td>
              ))}
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {extraAction && extraAction(row)}
                  <button
                    onClick={() => onEdit(row)}
                    className="rounded p-1.5 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
                    title="Modifier"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => onDelete(row)}
                    className="rounded p-1.5 text-gray-400 hover:bg-red-900/60 hover:text-red-400 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}