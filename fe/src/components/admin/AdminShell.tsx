'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { getAccessToken, setAccessToken } from '@/api/http';

function getEmailFromToken(token: string): string | null {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = JSON.parse(atob(parts[1])) as { email?: string };
    return typeof payload.email === 'string' ? payload.email : null;
  } catch {
    return null;
  }
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');
  return (
    <Link
      href={href}
      className={[
        'flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition',
        active
          ? 'bg-emerald-600 text-white'
          : 'text-zinc-700 hover:bg-zinc-100',
      ].join(' ')}
    >
      <span>{label}</span>
      {active ? <span className="text-white/80">•</span> : null}
    </Link>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.replace('/admin/login?reason=missing_token');
      return;
    }
    const emailFromToken = getEmailFromToken(token);
    setEmail(emailFromToken);
    setChecking(false);
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-200" />
          <div className="mt-6 grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="h-56 animate-pulse rounded-2xl bg-white" />
            </div>
            <div className="lg:col-span-9">
              <div className="h-80 animate-pulse rounded-2xl bg-white" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm text-zinc-600">Admin</div>
          </div>

          <div className="flex items-center gap-3">
            {email ? (
              <div className="hidden rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-700 md:block">
                {email}
              </div>
            ) : null}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSettingsOpen((v) => !v)}
                className="inline-flex size-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                aria-label="Mở cài đặt"
                title="Cài đặt"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="black" viewBox="0 0 24 24">
                  <path d="M19.14,12.94a7.43,7.43,0,0,0,.05-1l2.11-1.65a.5.5,0,0,0,.12-.64l-2-3.46a.5.5,0,0,0-.6-.22l-2.49,1a7.28,7.28,0,0,0-.87-.5l-.38-2.65A.5.5,0,0,0,14.5,3h-4a.5.5,0,0,0-.49.42L9.63,6.07a7.28,7.28,0,0,0-.87.5l-2.49-1a.5.5,0,0,0-.6.22l-2,3.46a.5.5,0,0,0,.12.64L5.9,11.94a7.43,7.43,0,0,0,0,1L3.79,14.59a.5.5,0,0,0-.12.64l2,3.46a.5.5,0,0,0,.6.22l2.49-1a7.28,7.28,0,0,0,.87.5l.38,2.65a.5.5,0,0,0,.49.42h4a.5.5,0,0,0,.49-.42l.38-2.65a7.28,7.28,0,0,0,.87-.5l2.49,1a.5.5,0,0,0,.6-.22l2-3.46a.5.5,0,0,0-.12-.64ZM12,15.5A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                </svg>
              </button>
              {settingsOpen ? (
                <div className="absolute right-0 top-12 z-40 min-w-[180px] rounded-xl border border-zinc-200 bg-white p-1.5 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false);
                      router.push('/admin/settings');
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-700 hover:bg-zinc-100"
                  >
                    Đổi mật khẩu
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSettingsOpen(false);
                      setAccessToken(null);
                      router.replace('/admin/login');
                    }}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-3">
              <nav className="grid gap-1">
                <NavLink
                  href="/admin/contact-requests"
                  label="Hộp thư liên hệ"
                />
                <NavLink href="/admin/services" label="Dịch vụ" />
                <NavLink href="/admin/products" label="Sản phẩm" />
                <NavLink href="/admin/blogs" label="Blog" />
                <NavLink href="/admin/projects" label="Dự án" />
                <NavLink href="/admin/slides" label="Slides" />
                <NavLink href="/admin/accounts" label="Tài khoản" />
              </nav>
            </div>
          </aside>

          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}

