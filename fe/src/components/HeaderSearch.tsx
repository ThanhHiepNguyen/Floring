'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type HeaderSearchProps = {
  mobile?: boolean;
  onSubmitComplete?: () => void;
};

export function HeaderSearch({ mobile = false, onSubmitComplete }: HeaderSearchProps) {
  const router = useRouter();
  const [q, setQ] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(q.trim())}`);
        onSubmitComplete?.();
      }}
      className={mobile ? 'w-full' : 'hidden flex-1 justify-center px-4 md:flex'}
    >
      <div className={mobile ? 'relative w-full' : 'relative w-full max-w-sm'}>
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3.5-3.5" />
          </svg>
        </span>
        <input
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search services, products, projects..."
          className="h-10 w-full rounded-full border border-zinc-200 bg-white/85 pl-9 pr-4 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-400 transition-shadow focus:border-emerald-200 focus:ring-4 focus:ring-emerald-200/40 dark:border-zinc-800 dark:bg-zinc-950/60 dark:text-zinc-100 dark:focus:border-emerald-900/60 dark:focus:ring-emerald-900/20"
        />
      </div>
    </form>
  );
}

