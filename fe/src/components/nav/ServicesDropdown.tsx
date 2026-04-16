'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

import { api } from '@/api/http';
import { normalizeImageUrl } from '@/lib/asset';

type Service = {
  id: string;
  name: string;
  slug: string;
  imageUrl?: string | null;
};

export function ServicesDropdown() {
  const [items, setItems] = useState<Service[]>([]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await api.get<{ data?: Service[] }>('/service', {
          params: { page: 1, limit: 50 },
          signal: controller.signal,
        });
        const data = Array.isArray(res.data?.data) ? res.data.data : [];
        if (!cancelled) setItems(data);
      } catch {
        if (!cancelled) setItems([]);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  const sorted = useMemo(
    () => [...items].sort((a, b) => a.name.localeCompare(b.name)),
    [items],
  );

  return (
    <div className="group relative">
      <button
        type="button"
        className="group relative text-sm font-medium text-zinc-700 transition-colors hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-100"
      >
        Services ▾
        <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-zinc-900 transition-all group-hover:w-full dark:bg-zinc-100" />
      </button>

      {sorted.length ? (
        <div className="invisible absolute left-0 top-full z-50 mt-0 w-[min(92vw,860px)] pt-3 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100">
          <div className="absolute inset-x-0 -top-3 h-3" aria-hidden="true" />
          <div className="inline-block rounded-3xl border border-zinc-200/90 bg-white/95 p-4 shadow-[0_24px_70px_-40px_rgba(2,6,23,0.35)] backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
            <div className="grid gap-4 md:grid-cols-[220px_auto]">
              <div className="rounded-2xl border border-zinc-200/80 bg-gradient-to-b from-zinc-50 to-white p-5 dark:border-zinc-700 dark:from-zinc-900 dark:to-zinc-950">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
                  Service list
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  Services
                </h3>
                <Link
                  href="/services"
                  className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-emerald-300 text-emerald-700 transition hover:bg-emerald-50 dark:border-emerald-500/70 dark:text-emerald-300 dark:hover:bg-emerald-950/40"
                  aria-label="View all services"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
                    <path
                      d="M10 7l5 5-5 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>

              <div className="grid max-h-[430px] grid-cols-2 gap-3 overflow-auto pr-1 md:w-[440px] md:grid-cols-2">
                {sorted.map((c) => (
                  <Link
                    key={c.id}
                    href={`/services/${c.slug}`}
                    className="group/item rounded-2xl border border-zinc-200/90 bg-white p-2 shadow-[0_12px_28px_-22px_rgba(2,6,23,0.45)] transition-all duration-250 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_22px_40px_-24px_rgba(16,185,129,0.35)] dark:border-zinc-700 dark:bg-zinc-900/70 dark:hover:border-emerald-500/60"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-zinc-200/90 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
                      {c.imageUrl ? (
                        <Image
                          src={normalizeImageUrl(c.imageUrl)}
                          alt={c.name}
                          fill
                          unoptimized
                          className="object-cover transition duration-300 group-hover/item:scale-[1.06]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-100 via-zinc-100 to-white dark:from-emerald-900/30 dark:via-zinc-800 dark:to-zinc-900" />
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-transparent opacity-0 transition duration-300 group-hover/item:opacity-100" />
                    </div>
                    <p className="mt-2.5 line-clamp-2 text-center text-[13px] font-semibold leading-5 text-zinc-800 transition-colors group-hover/item:text-emerald-700 dark:text-zinc-200 dark:group-hover/item:text-emerald-300">
                      {c.name}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

