'use client';

import { useEffect, useState } from 'react';

import { API_BASE_URL, api, getAccessToken, toApiErrorMessage } from '@/api/http';
import type { AdminBlogStatus, BlogRow } from '@/types/admin';

export default function AdminBlogsPage() {
    const [status, setStatus] = useState<AdminBlogStatus>('loading');
    const [error, setError] = useState('');

    const [items, setItems] = useState<BlogRow[]>([]);

    const [editing, setEditing] = useState<BlogRow | null>(null);
    const [formOpen, setFormOpen] = useState(false);

    const [uploadingImage, setUploadingImage] = useState(false);

    const [form, setForm] = useState<{
        title?: string;
        slug?: string;
        excerpt?: string;
        content?: string;
        imageUrl?: string;
        isActive?: boolean;
    }>({});

    const loadBlogs = async () => {
        setStatus('loading');
        setError('');
        try {
            const res = await api.get('/blog');
            const data = Array.isArray(res.data) ? (res.data as BlogRow[]) : [];
            setItems(data);
            setStatus('idle');
        } catch (err) {
            setStatus('error');
            setError(toApiErrorMessage(err));
        }
    };

    useEffect(() => {
        void loadBlogs();
    }, []);

    const openCreate = () => {
        setEditing(null);
        setForm({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            imageUrl: '',
            isActive: true,
        });
        setFormOpen(true);
    };

    const openEdit = (row: BlogRow) => {
        setEditing(row);
        setForm({
            title: row.title,
            slug: row.slug,
            excerpt: row.excerpt ?? '',
            content: row.content ?? '',
            imageUrl: row.imageUrl ?? '',
            isActive: row.isActive,
        });
        setFormOpen(true);
    };

    const closeForm = () => {
        setFormOpen(false);
        setEditing(null);
        setForm({});
        setUploadingImage(false);
    };

    const saveForm = async (e: React.FormEvent) => {
        e.preventDefault();

        const title = form.title?.trim();
        const slug = form.slug?.trim();
        const content = form.content?.trim();

        if (!title || !slug || !content) {
            setError('Vui lòng nhập đủ: title, slug, content.');
            return;
        }

        setStatus('saving');
        setError('');

        const payload = {
            title,
            slug,
            content,
            excerpt: form.excerpt?.trim() || undefined,
            imageUrl: form.imageUrl?.trim() || undefined,
            isActive: form.isActive ?? true,
        };

        try {
            if (editing) {
                await api.patch(`/blog/${editing.id}`, payload);
            } else {
                await api.post('/blog', payload);
            }
            await loadBlogs();
            closeForm();
        } catch (err) {
            setStatus('error');
            setError(toApiErrorMessage(err));
        }
    };

    const handleDelete = async (row: BlogRow) => {
        const ok = window.confirm(`Xóa bài viết "${row.title}"?`);
        if (!ok) return;

        try {
            setStatus('saving');
            setError('');
            await api.delete(`/blog/${row.id}`);
            await loadBlogs();
        } catch (err) {
            setStatus('error');
            setError(toApiErrorMessage(err));
        }
    };

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold">Blog</h2>
                    <p className="mt-1 text-sm text-zinc-600">
                        Quản lý bài viết (tạo, sửa, ẩn/hiển thị).
                    </p>
                </div>
                <button
                    type="button"
                    onClick={openCreate}
                    className="rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                    + Thêm bài viết
                </button>
            </div>

            {status === 'error' && error ? (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            ) : null}

            <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            <th className="py-3 pr-4">Tiêu đề</th>
                            <th className="py-3 pr-4">Slug</th>
                            <th className="py-3 pr-0 text-right">Hiển thị</th>
                            <th className="py-3 pr-0 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((p) => (
                            <tr key={p.id} className="border-b border-zinc-100">
                                <td className="py-3 pr-4 font-medium text-zinc-900">{p.title}</td>
                                <td className="py-3 pr-4 font-mono text-xs text-zinc-600">{p.slug}</td>
                                <td className="py-3 pr-0 text-right text-xs text-zinc-600">
                                    {p.isActive ? 'Đang hiển thị' : 'Ẩn'}
                                </td>
                                <td className="py-3 pr-0 text-right text-xs">
                                    <button
                                        type="button"
                                        onClick={() => openEdit(p)}
                                        disabled={status === 'saving'}
                                        className="rounded-lg px-2 py-1 font-medium text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-zinc-400"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => void handleDelete(p)}
                                        disabled={status === 'saving'}
                                        className="ml-1 rounded-lg px-2 py-1 font-medium text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-zinc-400"
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
                                    Chưa có bài viết.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>

            {formOpen ? (
                <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50/60 p-4">
                    <h3 className="text-sm font-semibold text-zinc-900">
                        {editing ? 'Sửa bài viết' : 'Thêm bài viết mới'}
                    </h3>

                    <form onSubmit={saveForm} className="mt-3 grid gap-3 text-sm">
                        <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="text-xs font-medium text-zinc-700">Tiêu đề *</label>
                                <input
                                    type="text"
                                    value={form.title ?? ''}
                                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-zinc-700">Slug *</label>
                                <input
                                    type="text"
                                    value={form.slug ?? ''}
                                    onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-medium text-zinc-700">Excerpt</label>
                            <textarea
                                value={form.excerpt ?? ''}
                                onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
                                rows={2}
                                className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                            />
                        </div>

                        <div className="grid gap-3 sm:grid-cols-[2fr,1.2fr]">
                            <div>
                                <label className="text-xs font-medium text-zinc-700">Nội dung (Markdown) *</label>
                                <textarea
                                    value={form.content ?? ''}
                                    onChange={(e) => setForm((prev) => ({ ...prev, content: e.target.value }))}
                                    rows={8}
                                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 font-mono"
                                />
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs font-medium text-zinc-700">imageUrl</label>
                                    <input
                                        type="text"
                                        value={form.imageUrl ?? ''}
                                        onChange={(e) => setForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                                        placeholder="Hoặc upload ảnh"
                                        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                                    />
                                    {form.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={form.imageUrl}
                                            alt="preview"
                                            className="mt-2 h-24 w-full rounded-lg border border-zinc-200 object-cover"
                                        />
                                    ) : null}
                                </div>

                                <div>
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
                                    {uploadingImage ? (
                                        <p className="mt-1 text-xs text-zinc-500">Đang upload ảnh...</p>
                                    ) : null}
                                </div>

                                <label className="inline-flex items-center gap-2 text-xs text-zinc-700">
                                    <input
                                        type="checkbox"
                                        checked={form.isActive ?? true}
                                        onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                                        className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                                    />
                                    Hiển thị (isActive)
                                </label>
                            </div>
                        </div>

                        <div className="mt-2 flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={closeForm}
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 hover:bg-zinc-100"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={status === 'saving'}
                                className="rounded-lg bg-emerald-600 px-3.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-400"
                            >
                                {status === 'saving' ? 'Đang lưu...' : editing ? 'Lưu thay đổi' : 'Tạo bài viết'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : null}
        </div>
    );
}

