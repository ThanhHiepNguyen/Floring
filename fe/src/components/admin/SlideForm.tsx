'use client';

import { useState } from 'react';
import { API_BASE_URL, api, getAccessToken, toApiErrorMessage } from '@/api/http';

export type SlideInput = {
    id?: string;
    title: string;
    description?: string;
    imageUrl: string;
    ctaLabel?: string;
    ctaHref?: string;
    sortOrder?: number;
    isActive?: boolean;
};

export function SlideForm({
    initial,
    onSaved,
    onCancel,
}: {
    initial: SlideInput | null;
    onSaved: () => void;
    onCancel: () => void;
}) {
    const [status, setStatus] = useState<'idle' | 'saving'>('idle');
    const [error, setError] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);
    const [form, setForm] = useState<SlideInput>(
        initial ?? { title: '', imageUrl: '', description: '', isActive: true, sortOrder: 0 },
    );

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('saving');
        setError('');
        try {
            const payload = {
                title: form.title.trim(),
                imageUrl: form.imageUrl.trim(),
                description: form.description?.trim() || undefined,
                ctaLabel: form.ctaLabel?.trim() || undefined,
                ctaHref: form.ctaHref?.trim() || undefined,
                sortOrder: form.sortOrder ?? 0,
                isActive: form.isActive ?? true,
            };
            if (initial?.id) {
                await api.patch(`/homepage-slides/${initial.id}`, payload);
            } else {
                await api.post('/homepage-slides', payload);
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
                    <label className="text-xs font-medium text-zinc-700">Ảnh (imageUrl) *</label>
                    <input
                        value={form.imageUrl}
                        onChange={(e) => setForm((p) => ({ ...p, imageUrl: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                    />
                    {form.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={form.imageUrl}
                            alt="slide preview"
                            className="mt-2 h-24 w-full rounded-lg border border-zinc-200 object-cover"
                        />
                    ) : null}
                    <div className="mt-2">
                        <label className="text-xs font-medium text-zinc-700">Upload ảnh</label>
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
                                    setError(toApiErrorMessage(err));
                                } finally {
                                    setUploadingImage(false);
                                }
                            }}
                            className="mt-1 block w-full text-xs text-zinc-700 file:mr-2 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        {uploadingImage ? <p className="mt-1 text-xs text-zinc-500">Đang upload ảnh...</p> : null}
                    </div>
                </div>
            </div>
            <div>
                <label className="text-xs font-medium text-zinc-700">Mô tả ngắn</label>
                <textarea
                    rows={3}
                    value={form.description ?? ''}
                    onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
                <div>
                    <label className="text-xs font-medium text-zinc-700">CTA Label</label>
                    <input
                        value={form.ctaLabel ?? ''}
                        onChange={(e) => setForm((p) => ({ ...p, ctaLabel: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-zinc-700">CTA Href</label>
                    <input
                        value={form.ctaHref ?? ''}
                        onChange={(e) => setForm((p) => ({ ...p, ctaHref: e.target.value }))}
                        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none"
                    />
                </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <div>
                    <label className="text-xs font-medium text-zinc-700">Sort order</label>
                    <input
                        type="number"
                        value={form.sortOrder ?? 0}
                        onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) || 0 }))}
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
                    {status === 'saving' ? 'Đang lưu...' : initial?.id ? 'Lưu thay đổi' : 'Tạo slide'}
                </button>
            </div>
        </form>
    );
}

