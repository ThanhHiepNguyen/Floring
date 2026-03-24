'use client';

import { useEffect, useState } from 'react';
import { api, toApiErrorMessage } from '@/api/http';
import { Dialog } from '@/components/ui/Dialog';
import { SlideForm, type SlideInput } from '@/components/admin/SlideForm';

type SlideRow = SlideInput & { id: string; createdAt: string; updatedAt: string };

export default function AdminSlidesPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  const [error, setError] = useState('');
  const [items, setItems] = useState<SlideRow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SlideRow | null>(null);

  const loadSlides = async () => {
    setStatus('loading');
    setError('');
    try {
      const res = await api.get('/homepage-slides/admin', { params: { page: 1, limit: 100 } });
      const data = Array.isArray(res.data?.data) ? (res.data.data as SlideRow[]) : [];
      setItems(data);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setError(toApiErrorMessage(err));
    }
  };

  useEffect(() => {
    void loadSlides();
  }, []);

  const onCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };
  const onEdit = (row: SlideRow) => {
    setEditing(row);
    setDialogOpen(true);
  };
  const onSaved = async () => {
    setDialogOpen(false);
    setEditing(null);
    await loadSlides();
  };
  const onDelete = async (row: SlideRow) => {
    const ok = window.confirm(`Xóa slide "${row.title}"?`);
    if (!ok) return;
    try {
      await api.delete(`/homepage-slides/${row.id}`);
      await loadSlides();
    } catch (err) {
      setError(toApiErrorMessage(err));
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Homepage slides</h2>
          <p className="mt-1 text-sm text-zinc-600">Quản lý slide đầu trang.</p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          className="rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          + Thêm slide
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
              <th className="py-3 pr-4">Ảnh</th>
              <th className="py-3 pr-4">Hiển thị</th>
              <th className="py-3 pr-0 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-b border-zinc-100">
                <td className="py-3 pr-4 font-medium text-zinc-900">{s.title}</td>
                <td className="py-3 pr-4 text-xs text-zinc-600">{s.imageUrl}</td>
                <td className="py-3 pr-4 text-xs text-zinc-600">{s.isActive ? 'Đang hiển thị' : 'Ẩn'}</td>
                <td className="py-3 pr-0 text-right text-xs">
                  <button onClick={() => onEdit(s)} className="rounded-lg px-2 py-1 font-medium text-emerald-700 hover:bg-emerald-50">
                    Sửa
                  </button>
                  <button onClick={() => void onDelete(s)} className="ml-1 rounded-lg px-2 py-1 font-medium text-rose-600 hover:bg-rose-50">
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
            {status === 'loading' && items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-sm text-zinc-500">
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
        title={editing ? 'Sửa slide' : 'Thêm slide mới'}
      >
        <SlideForm
          initial={
            editing
              ? {
                  id: editing.id,
                  title: editing.title,
                  description: editing.description,
                  imageUrl: editing.imageUrl,
                  ctaLabel: editing.ctaLabel,
                  ctaHref: editing.ctaHref,
                  sortOrder: editing.sortOrder,
                  isActive: editing.isActive,
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

