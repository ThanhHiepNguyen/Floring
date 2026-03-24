'use client';

import { useEffect, useState } from 'react';
import { api, toApiErrorMessage } from '@/api/http';

type ServiceItem = { id: string; name: string };

export type ProjectInput = {
  id?: string;
  title: string;
  slug?: string;
  serviceId: string;
  description?: string;
  roomDetails?: string;
  totalAreaM2?: number;
  imageUrl?: string;
  isActive?: boolean;
};

export function ProjectForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial: ProjectInput | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving'>('loading');
  const [error, setError] = useState('');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [form, setForm] = useState<ProjectInput>(
    initial ?? { title: '', slug: '', serviceId: '', description: '', isActive: true },
  );

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/service', { params: { page: 1, limit: 100 } });
        const data = Array.isArray(res.data?.data) ? (res.data.data as any[]) : [];
        setServices(data.map((s) => ({ id: s.id as string, name: s.name as string })));
      } catch {
        // ignore
      } finally {
        setStatus('idle');
      }
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    setError('');
    try {
      const payload: any = {
        title: form.title.trim(),
        slug: form.slug?.trim() || undefined,
        serviceId: form.serviceId,
        description: form.description?.trim() || undefined,
        roomDetails: form.roomDetails?.trim() || undefined,
        totalAreaM2: form.totalAreaM2 ?? undefined,
        isActive: form.isActive ?? true,
      };
      if (form.imageUrl) payload.images = [{ imageUrl: form.imageUrl }];

      if (initial?.id) {
        await api.patch(`/project/${initial.id}`, payload);
      } else {
        await api.post('/project', payload);
      }
      onSaved();
    } catch (err) {
      setError(toApiErrorMessage(err));
    } finally {
      setStatus('idle');
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-3 text-sm">
      {error ? <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{error}</div> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-zinc-700">Tiêu đề *</label>
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-700">Slug</label>
          <input
            value={form.slug ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-zinc-700">Dịch vụ (serviceId) *</label>
          <select
            value={form.serviceId}
            onChange={(e) => setForm((p) => ({ ...p, serviceId: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none"
          >
            <option value="">-- Chọn dịch vụ --</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-700">Diện tích (m2)</label>
          <input
            type="number"
            value={form.totalAreaM2 ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, totalAreaM2: Number(e.target.value) || undefined }))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-zinc-700">Mô tả</label>
          <textarea
            rows={4}
            value={form.description ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-zinc-700">Chi tiết phòng</label>
          <textarea
            rows={4}
            value={form.roomDetails ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, roomDetails: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-zinc-700">Ảnh cover (imageUrl)</label>
          <input
            value={form.imageUrl ?? ''}
            onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none"
          />
        </div>
        <label className="mt-6 inline-flex items-center gap-2 text-xs text-zinc-700">
          <input
            type="checkbox"
            checked={form.isActive ?? true}
            onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
            className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
          />
          Hiển thị
        </label>
      </div>

      <div className="mt-1 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100">
          Hủy
        </button>
        <button
          type="submit"
          disabled={status === 'saving'}
          className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
        >
          {status === 'saving' ? 'Đang lưu...' : initial?.id ? 'Lưu thay đổi' : 'Tạo dự án'}
        </button>
      </div>
    </form>
  );
}

