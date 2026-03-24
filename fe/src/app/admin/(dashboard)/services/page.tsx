'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { api, toApiErrorMessage } from '@/api/http';
import { Dialog } from '@/components/ui/Dialog';
import { ServiceForm } from '@/components/admin/ServiceForm';
import type { ServiceListResponse, ServiceRow } from '@/types/services';

export default function AdminServicesPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');
  const [error, setError] = useState('');

  const [items, setItems] = useState<ServiceRow[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceRow | null>(null);

  const loadServices = async (nextPage = page) => {
    setStatus('loading');
    setError('');
    try {
      const res = await api.get<ServiceListResponse>('/service/admin', {
        params: { page: nextPage, limit },
      });
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setItems(data);
      setPage(res.data?.page ?? nextPage);
      setTotalPages(res.data?.totalPages ?? 1);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setError(toApiErrorMessage(err));
    }
  };

  useEffect(() => {
    void loadServices(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'loading') return;
    void loadServices(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const it of items) {
      const k = it.isActive ? 'active' : 'inactive';
      out[k] = (out[k] ?? 0) + 1;
    }
    return out;
  }, [items]);

  const handleEdit = (row: ServiceRow) => {
    setEditing(row);
    setDialogOpen(true);
  };

  const handleCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const handleDelete = async (row: ServiceRow) => {
    const ok = window.confirm(`Xóa dịch vụ "${row.name}"?`);
    if (!ok) return;
    try {
      setStatus('loading');
      await api.delete(`/service/${row.id}`);
      await loadServices(page);
    } catch (err) {
      setStatus('error');
      setError(toApiErrorMessage(err));
    }
  };

  const handleSaved = async () => {
    setDialogOpen(false);
    setEditing(null);
    await loadServices(page);
    router.push('/admin/services');
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Dịch vụ</h2>
          <p className="mt-1 text-sm text-zinc-600">
            Quản lý danh sách dịch vụ (thiết bị/sàn) và thông tin hiển thị.
          </p>
        </div>
        <div className="text-right text-xs text-zinc-500">
          <div>Tổng: {items.length}</div>
          <div>Active: {counts.active ?? 0}</div>
          <div>Inactive: {counts.inactive ?? 0}</div>
        </div>
      </div>

      {status === 'error' ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <th className="py-3 pr-4">Tên</th>
              <th className="py-3 pr-4">Slug</th>
              <th className="py-3 pr-4">Hiển thị</th>
              <th className="py-3 pr-0 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s.id} className="border-b border-zinc-100">
                <td className="py-3 pr-4 font-medium text-zinc-900">{s.name}</td>
                <td className="py-3 pr-4 font-mono text-xs text-zinc-600">{s.slug}</td>
                <td className="py-3 pr-4 text-xs text-zinc-600">
                  {s.isActive ? 'Đang hiển thị' : 'Ẩn'}
                </td>
                <td className="py-3 pr-0 text-right text-xs">
                  <button
                    type="button"
                    onClick={() => handleEdit(s)}
                    className="rounded-lg px-2 py-1 font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    Sửa
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(s)}
                    className="ml-1 rounded-lg px-2 py-1 font-medium text-rose-600 hover:bg-rose-50"
                  >
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
            {status === 'idle' && items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-sm text-zinc-500">
                  Chưa có dịch vụ.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-600">
        <div>
          Trang <span className="font-semibold">{page}</span> / {totalPages}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-lg px-2 py-1 font-medium disabled:text-zinc-400 disabled:hover:bg-transparent hover:bg-zinc-100"
          >
            Trang trước
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="rounded-lg px-2 py-1 font-medium disabled:text-zinc-400 disabled:hover:bg-transparent hover:bg-zinc-100"
          >
            Trang sau
          </button>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          + Thêm dịch vụ
        </button>
      </div>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditing(null);
        }}
        title={editing ? 'Sửa dịch vụ' : 'Thêm dịch vụ mới'}
      >
        <ServiceForm
          initial={
            editing
              ? {
                  id: editing.id,
                  name: editing.name,
                  slug: editing.slug,
                  description: editing.description ?? undefined,
                  imageUrl: editing.imageUrl ?? undefined,
                  isActive: editing.isActive,
                }
              : null
          }
          onSaved={() => void handleSaved()}
          onCancel={() => {
            setDialogOpen(false);
            setEditing(null);
          }}
        />
      </Dialog>
    </div>
  );
}

