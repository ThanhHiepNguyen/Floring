'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import { api } from '@/api/http';

type Service = {
  id: string;
  name: string;
  slug: string;
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
        Dịch vụ ▾
        <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-zinc-900 transition-all group-hover:w-full dark:bg-zinc-100" />
      </button>

      {sorted.length ? (
        <div className="invisible absolute left-0 top-full z-50 mt-0 w-[320px] pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100">
          <div className="absolute inset-x-0 -top-3 h-3" aria-hidden="true" />
          <div className="rounded-2xl border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
            <div className="px-3 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500 dark:text-zinc-400">
              Danh sách dịch vụ
            </div>
            <div className="max-h-[360px] overflow-auto">
              {sorted.map((c) => (
                <Link
                  key={c.id}
                  href={`/services/${c.slug}`}
                  className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-900/40"
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-zinc-400">›</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

