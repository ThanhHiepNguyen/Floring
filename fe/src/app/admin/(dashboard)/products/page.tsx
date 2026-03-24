'use client';

import { useEffect, useMemo, useState } from 'react';

import { productApi } from '@/api';
import { api, toApiErrorMessage } from '@/api/http';

type ServiceOption = { id: string; name: string };
type FormState = {
  serviceId: string;
  name: string;
  slug: string;
  brand: string;
  imageUrl: string;
  description: string;
  style: string;
  range: string;
  priceGuide: string;
  priceSortOrder: string;
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  serviceId: '',
  name: '',
  slug: '',
  brand: '',
  imageUrl: '',
  description: '',
  style: '',
  range: '',
  priceGuide: '',
  priceSortOrder: '',
  isActive: true,
};

export default function AdminProductsPage() {
  const PAGE_SIZE = 6;
  const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [items, setItems] = useState<productApi.AdminProduct[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const loadProducts = async (nextPage = page) => {
    setStatus('loading');
    setError('');
    try {
      const res = await productApi.getProducts({ page: nextPage, limit: PAGE_SIZE });
      setItems(Array.isArray(res.data?.products) ? res.data.products : []);
      setPage(res.meta?.page ?? nextPage);
      setTotalPages(res.meta?.totalPages ?? 1);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setError(toApiErrorMessage(err));
    }
  };

  const loadServices = async () => {
    try {
      const res = await api.get('/service/admin', { params: { page: 1, limit: 200 } });
      const raw = Array.isArray(res.data?.data) ? res.data.data : [];
      setServices(raw.map((it: { id: string; name: string }) => ({ id: it.id, name: it.name })));
    } catch {
      setServices([]);
    }
  };

  useEffect(() => {
    void loadProducts(1);
    void loadServices();
  }, []);

  useEffect(() => {
    if (!notice) return;
    const t = window.setTimeout(() => setNotice(null), 2500);
    return () => window.clearTimeout(t);
  }, [notice]);

  const counts = useMemo(() => ({ total: items.length }), [items]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const openCreate = () => {
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (row: productApi.AdminProduct) => {
    setEditingId(row.id);
    setForm({
      ...EMPTY_FORM,
      serviceId: row.serviceId ?? '',
      name: row.title ?? '',
      slug: row.permalink ?? '',
      brand: row.brand ?? '',
    });
    setFormOpen(true);
  };

  const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.serviceId || !form.name.trim() || !form.slug.trim()) {
      setNotice({ type: 'error', message: 'Vui lòng nhập service, tên và slug' });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        serviceId: form.serviceId,
        name: form.name.trim(),
        slug: form.slug.trim(),
        brand: form.brand.trim() || undefined,
        imageUrl: form.imageUrl.trim() || undefined,
        description: form.description.trim() || undefined,
        style: form.style.trim() || undefined,
        range: form.range.trim() || undefined,
        priceGuide: form.priceGuide.trim() || undefined,
        priceSortOrder: form.priceSortOrder.trim() ? Number(form.priceSortOrder) : undefined,
        isActive: form.isActive,
      };

      if (editingId) {
        const res = await productApi.updateProduct(editingId, payload);
        setNotice({ type: 'success', message: res.message || 'Cập nhật product thành công' });
      } else {
        const res = await productApi.createProduct(payload);
        setNotice({ type: 'success', message: res.message || 'Tạo product thành công' });
      }

      setFormOpen(false);
      resetForm();
      await loadProducts(page);
    } catch (err) {
      setNotice({ type: 'error', message: toApiErrorMessage(err) });
    } finally {
      setSaving(false);
    }
  };

  const removeProduct = async (id: string, title: string) => {
    if (!window.confirm(`Xóa sản phẩm "${title}"?`)) return;
    try {
      setDeletingId(id);
      const res = await productApi.deleteProduct(id);
      setNotice({ type: 'success', message: res.message || 'Xóa product thành công' });
      await loadProducts(page);
    } catch (err) {
      setNotice({ type: 'error', message: toApiErrorMessage(err) });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6">
      {notice ? (
        <div className="fixed right-6 top-20 z-[120]">
          <div
            className={[
              'min-w-[280px] rounded-xl px-4 py-3 text-sm shadow-lg',
              notice.type === 'success'
                ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border border-rose-200 bg-rose-50 text-rose-700',
            ].join(' ')}
          >
            {notice.message}
          </div>
        </div>
      ) : null}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">Sản phẩm</h2>
          <p className="mt-1 text-sm text-zinc-600">Quản lý sản phẩm: tạo mới, cập nhật và xóa.</p>
        </div>
        <div className="text-right text-xs text-zinc-500">
          <div>Tổng: {counts.total}</div>
        </div>
      </div>

      {status === 'error' ? (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {formOpen ? (
        <form onSubmit={submitForm} className="mt-4 grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-3">
          <label className="grid gap-1 text-sm">
            <span>Service</span>
            <select
              value={form.serviceId}
              onChange={(e) => setForm((f) => ({ ...f, serviceId: e.target.value }))}
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
              required
            >
              <option value="">Chọn dịch vụ</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1 text-sm">
            <span>Tên</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
              required
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Slug</span>
            <input
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
              className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm"
              required
            />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Brand</span>
            <input value={form.brand} onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))} className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm" />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Image URL</span>
            <input value={form.imageUrl} onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))} className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm" />
          </label>
          <label className="grid gap-1 text-sm">
            <span>Price sort order</span>
            <input value={form.priceSortOrder} onChange={(e) => setForm((f) => ({ ...f, priceSortOrder: e.target.value }))} className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm" />
          </label>
          <label className="md:col-span-3 grid gap-1 text-sm">
            <span>Mô tả</span>
            <textarea value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="min-h-24 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm" />
          </label>
          <div className="md:col-span-3 flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-sm text-zinc-700">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Hiển thị
            </label>
            <div className="flex gap-2">
              <button type="button" onClick={() => { setFormOpen(false); resetForm(); }} className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100">Hủy</button>
              <button disabled={saving} type="submit" className="rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
                {saving ? 'Đang lưu...' : editingId ? 'Cập nhật' : 'Tạo mới'}
              </button>
            </div>
          </div>
        </form>
      ) : null}

      <div className="mt-5 overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500">
              <th className="py-3 pr-4">Tên</th>
              <th className="py-3 pr-4">Slug</th>
              <th className="py-3 pr-4">Dịch vụ</th>
              <th className="py-3 pr-4">Brand</th>
              <th className="py-3 pr-0 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-zinc-100">
                <td className="py-3 pr-4 font-medium text-zinc-900">{it.title}</td>
                <td className="py-3 pr-4 font-mono text-xs text-zinc-600">{it.permalink}</td>
                <td className="py-3 pr-4 text-xs text-zinc-700">{it.serviceName ?? '-'}</td>
                <td className="py-3 pr-4 text-xs text-zinc-700">{it.brand ?? '-'}</td>
                <td className="py-3 pr-0 text-right text-xs">
                  <button type="button" onClick={() => openEdit(it)} className="rounded-lg px-2 py-1 font-medium text-emerald-700 hover:bg-emerald-50">Sửa</button>
                  <button
                    type="button"
                    onClick={() => void removeProduct(it.id, it.title)}
                    disabled={deletingId === it.id}
                    className="ml-1 rounded-lg px-2 py-1 font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                  >
                    {deletingId === it.id ? 'Đang xóa...' : 'Xóa'}
                  </button>
                </td>
              </tr>
            ))}
            {status === 'loading' && items.length === 0 ? (
              <tr><td colSpan={5} className="py-6 text-sm text-zinc-500">Đang tải...</td></tr>
            ) : null}
            {status === 'idle' && items.length === 0 ? (
              <tr><td colSpan={5} className="py-6 text-sm text-zinc-500">Chưa có sản phẩm.</td></tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-zinc-600">
        <div>Trang <span className="font-semibold">{page}</span> / {totalPages}</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => void loadProducts(Math.max(1, page - 1))}
            className="rounded-lg px-2 py-1 font-medium disabled:text-zinc-400 hover:bg-zinc-100"
          >
            Trang trước
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => void loadProducts(Math.min(totalPages, page + 1))}
            className="rounded-lg px-2 py-1 font-medium disabled:text-zinc-400 hover:bg-zinc-100"
          >
            Trang sau
          </button>
        </div>
      </div>
    </div>
  );
}

