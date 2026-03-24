'use client';

import { useEffect, useMemo, useState } from 'react';

import { API_BASE_URL, api, getAccessToken, toApiErrorMessage } from '@/api/http';

type ServiceFormValue = {
  id?: string;
  name: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  isActive: boolean;
};

type ServiceFormProps = {
  initial?: ServiceFormValue | null;
  onSaved: () => void;
  onCancel: () => void;
};

export function ServiceForm({ initial, onSaved, onCancel }: ServiceFormProps) {
  const isEdit = !!initial?.id;

  const [form, setForm] = useState<ServiceFormValue>(() => ({
    id: initial?.id,
    name: initial?.name ?? '',
    slug: initial?.slug,
    description: initial?.description,
    imageUrl: initial?.imageUrl,
    isActive: initial?.isActive ?? true,
  }));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const canSubmit = useMemo(() => {
    return !!form.name.trim() && !saving;
  }, [form.name, saving]);

  useEffect(() => {
    setForm({
      id: initial?.id,
      name: initial?.name ?? '',
      slug: initial?.slug,
      description: initial?.description,
      imageUrl: initial?.imageUrl,
      isActive: initial?.isActive ?? true,
    });
  }, [initial]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setSaving(true);
    setError('');

    const payload = {
      name: form.name.trim(),
      slug: form.slug?.trim() || undefined,
      description: form.description?.trim() || undefined,
      imageUrl: form.imageUrl?.trim() || undefined,
      isActive: form.isActive,
    };

    try {
      if (isEdit && form.id) {
        await api.patch(`/service/${form.id}`, payload);
      } else {
        await api.post('/service', payload);
      }
      onSaved();
    } catch (err) {
      setError(toApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-zinc-800">
          Tên dịch vụ <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-zinc-800">Slug</label>
          <input
            type="text"
            value={form.slug ?? ''}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            placeholder="Để trống để tự tạo theo tên"
            className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        <label className="inline-flex items-center gap-2 text-sm font-medium text-zinc-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
          />
          Hiển thị (isActive)
        </label>
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-800">Mô tả</label>
        <textarea
          value={form.description ?? ''}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-zinc-800">Ảnh (imageUrl)</label>
        <input
          type="text"
          value={form.imageUrl ?? ''}
          onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
          placeholder="URL hoặc upload ảnh"
          className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
        />

        <div className="mt-2">
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              try {
                setUploadingImage(true);
                const fd = new FormData();
                fd.append('file', file);
                const token = getAccessToken();
                const res = await fetch(`${API_BASE_URL}/upload/image`, {
                  method: 'POST',
                  headers: token ? { Authorization: `Bearer ${token}` } : undefined,
                  body: fd,
                });
                if (!res.ok) throw new Error('Upload ảnh thất bại');
                const data = await res.json();
                if (data?.url) {
                  setForm((prev) => ({ ...prev, imageUrl: data.url as string }));
                }
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Upload ảnh lỗi. Vui lòng thử lại.');
              } finally {
                setUploadingImage(false);
              }
            }}
            className="block w-full text-xs text-zinc-700 file:mr-2 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
          />
          {uploadingImage ? (
            <p className="mt-1 text-xs text-zinc-500">Đang upload ảnh...</p>
          ) : null}
        </div>
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
        >
          Hủy
        </button>
        <button
          type="submit"
          disabled={!canSubmit}
          className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
        >
          {saving ? 'Đang lưu...' : isEdit ? 'Lưu thay đổi' : 'Tạo dịch vụ'}
        </button>
      </div>
    </form>
  );
}

