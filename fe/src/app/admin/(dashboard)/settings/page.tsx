'use client';

import { useState } from 'react';

import { authApi } from '@/api';
import { toApiErrorMessage } from '@/api/http';

type Notice = { type: 'success' | 'error'; message: string } | null;

export default function AdminSettingsPage() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [notice, setNotice] = useState<Notice>(null);

    const submitChangePassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setNotice(null);

        if (newPassword !== confirmPassword) {
            setNotice({ type: 'error', message: 'Mật khẩu xác nhận không khớp' });
            return;
        }

        try {
            setSubmitting(true);
            const res = await authApi.changePassword({ oldPassword, newPassword });
            setNotice({ type: 'success', message: res.message || 'Đổi mật khẩu thành công' });
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setNotice({ type: 'error', message: toApiErrorMessage(err) });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
            <h2 className="text-lg font-semibold">Cài đặt tài khoản</h2>
            <p className="mt-1 text-sm text-zinc-600">Đổi mật khẩu đăng nhập quản trị.</p>

            {notice ? (
                <div
                    className={[
                        'mt-4 rounded-xl px-4 py-3 text-sm',
                        notice.type === 'success'
                            ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border border-rose-200 bg-rose-50 text-rose-700',
                    ].join(' ')}
                >
                    {notice.message}
                </div>
            ) : null}

            <form onSubmit={submitChangePassword} className="mt-5 grid max-w-xl gap-3">
                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-700">Mật khẩu hiện tại</span>
                    <div className="relative">
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 pr-14 text-sm outline-none ring-emerald-200 focus:ring-2"
                        />
                        <button
                            type="button"
                            onClick={() => setShowOldPassword((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900"
                            aria-label={showOldPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            title={showOldPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                            {showOldPassword ? (
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

                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-700">Mật khẩu mới</span>
                    <div className="relative">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 pr-14 text-sm outline-none ring-emerald-200 focus:ring-2"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900"
                            aria-label={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            title={showNewPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                            {showNewPassword ? (
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

                <label className="grid gap-1 text-sm">
                    <span className="text-zinc-700">Xác nhận mật khẩu mới</span>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-10 w-full rounded-lg border border-zinc-300 bg-white px-3 pr-14 text-sm outline-none ring-emerald-200 focus:ring-2"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword((v) => !v)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900"
                            aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                            title={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                            {showConfirmPassword ? (
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

                <div className="pt-1">
                    <button
                        type="submit"
                        disabled={
                            submitting ||
                            !oldPassword.trim() ||
                            !newPassword.trim() ||
                            !confirmPassword.trim()
                        }
                        className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
                    </button>
                </div>
            </form>
        </div>
    );
}

