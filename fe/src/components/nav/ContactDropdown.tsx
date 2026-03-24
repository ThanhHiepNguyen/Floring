'use client';

import Link from 'next/link';

export function ContactDropdown() {
  return (
    <Link
      href="/contact"
      className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700 hover:shadow dark:border-emerald-900/60 dark:bg-emerald-500 dark:hover:bg-emerald-600"
      aria-label="Đi tới form liên hệ"
    >
      Liên hệ
    </Link>
  );
}

