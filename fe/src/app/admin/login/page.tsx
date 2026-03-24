'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { authApi } from '@/api';

export default function AdminLoginPage() {
    const router = useRouter();
    const [status, setStatus] = useState<'idle' | 'submitting' | 'error'>('idle');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const sp = new URLSearchParams(window.location.search);
        const reason = sp.get('reason');
        if (reason === 'unauthorized') setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        if (reason === 'missing_token') setError('Bạn cần đăng nhập để truy cập trang admin.');
    }, []);

    return (
        <main className="min-h-screen bg-zinc-50 text-zinc-900">
            <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <div className="text-sm text-zinc-600">Admin</div>
                    <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                        Đăng nhập
                    </h1>


                    <form
                        className="mt-6 grid gap-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            setStatus('submitting');
                            setError('');
                            const data = new FormData(e.currentTarget);
                            const email = String(data.get('email') ?? '').trim();
                            const password = String(data.get('password') ?? '').trim();

                            try {
                                await authApi.login({ email, password });
                                setStatus('idle');
                                router.replace('/admin/contact-requests');
                            } catch (err) {
                                setStatus('error');
                                setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
                            }
                        }}
                    >
                        <div>
                            <label className="text-sm font-medium">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="mt-2 h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-200/40"
                                placeholder="admin@floring.vn"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">Mật khẩu</label>
                            <div className="relative mt-2">
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    className="h-11 w-full rounded-xl border border-zinc-200 bg-white px-4 pr-12 text-sm outline-none focus:border-emerald-300 focus:ring-4 focus:ring-emerald-200/40"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-900"
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
                        </div>

                        {status === 'error' ? (
                            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                {error}
                            </div>
                        ) : null}

                        <button
                            type="submit"
                            disabled={status === 'submitting'}
                            className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                        >
                            {status === 'submitting' ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </button>

                        <div className="text-xs text-zinc-500">
                            <Link href="/" className="underline underline-offset-4 hover:text-zinc-700">
                                ← Về trang shop
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}

