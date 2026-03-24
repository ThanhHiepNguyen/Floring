'use client';

import { useEffect, useMemo, useState } from 'react';

import { authApi } from '@/api';
import { toApiErrorMessage } from '@/api/http';

type Notice = { type: 'success' | 'error'; message: string } | null;

export default function AdminAccountsPage() {
    const [items, setItems] = useState<authApi.AdminUser[]>([]);
    const [status, setStatus] = useState<'loading' | 'idle' | 'error'>('loading');
    const [error, setError] = useState('');
    const [notice, setNotice] = useState<Notice>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [creatingOpen, setCreatingOpen] = useState(false);

    const loadAdmins = async () => {
        setStatus('loading');
        setError('');
        try {
            const res = await authApi.getAllAdmins();
            setItems(Array.isArray(res.data) ? res.data : []);
            setStatus('idle');
        } catch (err) {
            setStatus('error');
            setError(toApiErrorMessage(err));
        }
    };

    useEffect(() => {
        void loadAdmins();
    }, []);

    useEffect(() => {
        if (!notice) return;
        const timer = window.setTimeout(() => setNotice(null), 2600);
        return () => window.clearTimeout(timer);
    }, [notice]);

    const counts = useMemo(() => {
        let admin = 0;
        let staff = 0;
        for (const it of items) {
            if (it.role === 'admin') admin += 1;
            if (it.role === 'staff') staff += 1;
        }
        return { admin, staff };
    }, [items]);

    const createAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setNotice(null);
        try {
            const res = await authApi.register({ email: email.trim(), password });
            setNotice({ type: 'success', message: res.message || 'Tạo tài khoản thành công' });
            setEmail('');
            setPassword('');
            await loadAdmins();
        } catch (err) {
            setNotice({ type: 'error', message: toApiErrorMessage(err) });
        } finally {
            setSubmitting(false);
        }
    };

    const removeAccount = async (id: string, targetEmail: string) => {
        const ok = window.confirm(`Xóa tài khoản "${targetEmail}"?`);
        if (!ok) return;
        setDeletingId(id);
        setNotice(null);
        try {
            const res = await authApi.deleteAdmin(id);
            setNotice({ type: 'success', message: res.message || 'Xóa tài khoản thành công' });
            await loadAdmins();
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
                    <h2 className="text-lg font-semibold">Tài khoản quản trị</h2>
                    <p className="mt-1 text-sm text-zinc-600">
                        Tạo tài khoản mới (mặc định role staff), xem danh sách và xóa theo quyền.
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-zinc-500">
                        <div>Tổng: {items.length}</div>
                        <div>Admin: {counts.admin}</div>
                        <div>Staff: {counts.staff}</div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setCreatingOpen((v) => !v)}
                        className="mt-3 inline-flex h-9 items-center justify-center rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                    >
                        {creatingOpen ? 'Đóng tạo mới' : 'Tạo mới'}
                    </button>
                </div>
            </div>

            {status === 'error' ? (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            ) : null}

            {creatingOpen ? (
                <form onSubmit={createAccount} className="mt-5 grid gap-3 rounded-xl border border-zinc-200 bg-zinc-50 p-4 md:grid-cols-3">
                    <label className="grid gap-1 text-sm">
                        <span className="text-zinc-700">Email</span>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="staff@floring.local"
                            className="h-10 rounded-lg border border-zinc-300 bg-white px-3 text-sm outline-none ring-emerald-200 placeholder:text-zinc-400 focus:ring-2"
                        />
                    </label>
                    <label className="grid gap-1 text-sm">
                        <span className="text-zinc-700">Mật khẩu</span>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Tối thiểu 6 ký tự"
                                className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 pr-14 text-sm outline-none ring-emerald-200 placeholder:text-zinc-400 focus:ring-2"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900"
                                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                                title={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            >
                                {showPassword ? (
                                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M3 3l18 18" />
                                        <path d="M10.58 10.58a2 2 0 1 0 2.83 2.83" />
                                        <path d="M9.88 5.09A10.94 10.94 0 0 1 12 5c5 0 9.27 3.11 11 7-1 2.24-2.67 4.15-4.78 5.4M6.61 6.61C4.62 7.88 3 9.76 2 12c.65 1.46 1.6 2.8 2.79 3.95" />
                                    </svg>
                                ) : (
                                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </label>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            disabled={submitting || !email.trim() || password.length < 6}
                            className="inline-flex h-10 w-full items-center justify-center rounded-lg bg-emerald-600 px-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {submitting ? 'Đang tạo...' : 'Tạo tài khoản staff'}
                        </button>
                    </div>
                </form>
            ) : null}

            <div className="mt-5 overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-zinc-200 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                            <th className="py-3 pr-4">Email</th>
                            <th className="py-3 pr-4">Role</th>
                            <th className="py-3 pr-4">Tạo lúc</th>
                            <th className="py-3 pr-0 text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((it) => (
                            <tr key={it.id} className="border-b border-zinc-100">
                                <td className="py-3 pr-4 text-zinc-900">{it.email}</td>
                                <td className="py-3 pr-4">
                                    <span
                                        className={[
                                            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                                            it.role === 'admin'
                                                ? 'bg-indigo-100 text-indigo-700'
                                                : 'bg-emerald-100 text-emerald-700',
                                        ].join(' ')}
                                    >
                                        {it.role ?? 'staff'}
                                    </span>
                                </td>
                                <td className="py-3 pr-4 text-xs text-zinc-600">
                                    {it.createdAt ? new Date(it.createdAt).toLocaleString() : '-'}
                                </td>
                                <td className="py-3 pr-0 text-right">
                                    <button
                                        type="button"
                                        onClick={() => void removeAccount(it.id, it.email)}
                                        disabled={deletingId === it.id}
                                        className="rounded-lg px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                                    >
                                        {deletingId === it.id ? 'Đang xóa...' : 'Xóa'}
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
                                    Chưa có tài khoản.
                                </td>
                            </tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

