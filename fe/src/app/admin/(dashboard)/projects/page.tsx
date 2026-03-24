'use client';

import { useEffect, useState } from 'react';
import { api, toApiErrorMessage } from '@/api/http';
import { Dialog } from '@/components/ui/Dialog';
import { ProjectForm, type ProjectInput } from '@/components/admin/ProjectForm';

type ProjectRow = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
};

export default function AdminProjectsPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  const [error, setError] = useState('');
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectRow | null>(null);

  const loadProjects = async () => {
    setStatus('loading');
    setError('');
    try {
      const res = await api.get('/project', { params: { page: 1, limit: 100 } });
      const data = Array.isArray(res.data?.data) ? (res.data.data as ProjectRow[]) : [];
      setItems(data);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setError(toApiErrorMessage(err));
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  const onCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const onEdit = (row: ProjectRow) => {
    setEditing(row);
    setDialogOpen(true);
  };
  const onSaved = async () => {
    setDialogOpen(false);
    setEditing(null);
    await loadProjects();
  };
  const onDelete = async (row: ProjectRow) => {
    const ok = window.confirm(`Xóa dự án "${row.title}"?`);
    if (!ok) return;
    try {
      await api.delete(`/project/${row.id}`);
      await loadProjects();
    } catch (err) {
      setError(toApiErrorMessage(err));
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Dự án</h2>
          <p className="mt-1 text-sm text-zinc-600">Quản lý danh sách dự án.</p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          + Thêm dự án
        </button>
      </div>

      {status === 'error' && error ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <th className="py-3 pr-4">Tiêu đề</th>
              <th className="py-3 pr-4">Slug</th>
              <th className="py-3 pr-0 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-b border-zinc-100">
                <td className="py-3 pr-4 font-medium text-zinc-900">{p.title}</td>
                <td className="py-3 pr-4 font-mono text-xs text-zinc-600">{p.slug}</td>
                <td className="py-3 pr-0 text-right text-xs">
                  <button onClick={() => onEdit(p)} className="rounded-lg px-2 py-1 font-medium text-emerald-700 hover:bg-emerald-50">
                    Sửa
                  </button>
                  <button onClick={() => void onDelete(p)} className="ml-1 rounded-lg px-2 py-1 font-medium text-rose-600 hover:bg-rose-50">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {status === 'loading' && items.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-6 text-sm text-zinc-500">
                  Đang tải...
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        title={editing ? 'Sửa dự án' : 'Thêm dự án mới'}
      >
        <ProjectForm
          initial={
            editing
              ? {
                  id: editing.id,
                  title: editing.title,
                  slug: editing.slug,
                  serviceId: '',
                  description: editing.description ?? undefined,
                }
              : null
          }
          onSaved={onSaved}
          onCancel={() => {
            setDialogOpen(false);
            setEditing(null);
          }}
        />
      </Dialog>
    </div>
  );
}

