'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { contactRequestApi } from '@/api';
import type { ContactRow } from '@/types/admin';

const STATUS_OPTIONS = [
  { value: 'new', label: 'Mới' },
  { value: 'pending', label: 'Đang xử lý' },
  { value: 'contacted', label: 'Đã liên hệ' },
  { value: 'completed', label: 'Hoàn tất' },
  { value: 'cancelled', label: 'Hủy' },
] as const;

export default function AdminContactRequestsPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('loading');
  const [error, setError] = useState('');
  const [items, setItems] = useState<ContactRow[]>([]);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const counts = useMemo(() => {
    const out: Record<string, number> = {};
    for (const it of items) {
      const k = (it.status || 'new').toLowerCase();
      out[k] = (out[k] ?? 0) + 1;
    }
    return out;
  }, [items]);

  const unresolvedCount = (counts.new ?? 0) + (counts.pending ?? 0);

  const loadData = async () => {
    setStatus('loading');
    setError('');
    try {
      const res = await contactRequestApi.getContactRequests({ page: 1, limit: 50 });
      const data = Array.isArray(res?.data) ? (res.data as ContactRow[]) : [];
      setItems(data);
      setStatus('idle');
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Load failed');
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const saveStatus = async (id: string, nextStatus: string) => {
    try {
      setSavingId(id);
      await contactRequestApi.updateContactRequestStatus(id, { status: nextStatus });
      setItems((prev) =>
        prev.map((it) => (it.id === id ? { ...it, status: nextStatus } : it)),
      );
      setNotice({ type: 'success', message: 'Đã cập nhật trạng thái.' });
    } catch (err) {
      setNotice({
        type: 'error',
        message: err instanceof Error ? err.message : 'Cập nhật thất bại.',
      });
    } finally {
      setSavingId(null);
      setTimeout(() => setNotice(null), 2600);
    }
  };

  const removeRequest = async (id: string) => {
    if (!window.confirm('Xóa yêu cầu này?')) return;
    try {
      setSavingId(id);
      await contactRequestApi.deleteContactRequest(id);
      setItems((prev) => prev.filter((it) => it.id !== id));
      setNotice({ type: 'success', message: 'Đã xóa yêu cầu.' });
    } catch (err) {
      setNotice({
        type: 'error',
        message: err instanceof Error ? err.message : 'Xóa thất bại.',
      });
    } finally {
      setSavingId(null);
      setTimeout(() => setNotice(null), 2600);
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
          <h2 className="text-lg font-semibold">Hộp thư liên hệ</h2>
        </div>
        <div className="text-right text-xs text-zinc-500">
          <div>Tổng: {items.length}</div>
          <div>Chưa xử lý: {unresolvedCount}</div>
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
              <th className="py-3 pr-4">Khách</th>
              <th className="py-3 pr-4">Liên hệ</th>
              <th className="py-3 pr-4">Nội dung</th>
              <th className="py-3 pr-4">Trạng thái</th>
              <th className="py-3 pr-4">Ngày</th>
              <th className="py-3 pr-0 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id} className="border-b border-zinc-100 align-top">
                <td className="py-3 pr-4">
                  <div className="font-medium text-zinc-900">{it.name}</div>
                  {it.service ? (
                    <div className="mt-0.5 text-xs text-zinc-500">
                      {it.service.name}
                      {it.productVariant ? ` • ${it.productVariant.name}` : ''}
                    </div>
                  ) : null}
                </td>
                <td className="py-3 pr-4">
                  <a href={`tel:${it.phone}`} className="text-xs text-emerald-700 hover:underline">
                    {it.phone}
                  </a>
                  {it.email ? <div className="mt-1 text-xs text-zinc-500">{it.email}</div> : null}
                </td>
                <td className="py-3 pr-4">
                  <div className="max-w-[420px] whitespace-pre-wrap break-words text-zinc-700">
                    {it.message || '-'}
                  </div>
                </td>
                <td className="py-3 pr-4">
                  <select
                    value={String(it.status || 'new').toLowerCase()}
                    onChange={(e) => void saveStatus(it.id, e.target.value)}
                    className="rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700"
                    disabled={savingId === it.id}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 pr-4 text-zinc-600">
                  {new Date(it.createdAt).toLocaleString()}
                </td>
                <td className="py-3 pr-0 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      href={`/admin/contact-requests/${it.id}`}
                      className="rounded-lg border border-zinc-200 px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50"
                    >
                      Chi tiết
                    </Link>
                    <button
                      type="button"
                      onClick={() => void removeRequest(it.id)}
                      disabled={savingId === it.id}
                      className="rounded-lg border border-rose-200 px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {status === 'loading' ? (
              <tr>
                <td colSpan={6} className="py-6 text-sm text-zinc-500">
                  Đang tải...
                </td>
              </tr>
            ) : null}
            {status === 'idle' && items.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-sm text-zinc-500">
                  Chưa có yêu cầu nào.{' '}
                  <Link href="/contact" className="underline underline-offset-4">
                    Tạo thử từ trang Contact
                  </Link>
                  .
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

    </div>
  );
}

