'use client';

import Link from 'next/link';
import { useState } from 'react';

import { Container } from '@/components/Container';
import { HeaderSearch } from '@/components/HeaderSearch';
import { ServicesDropdown } from '@/components/nav/ServicesDropdown';
import { ContactDropdown } from '@/components/nav/ContactDropdown';

const navItems = [
    { href: '/projects', label: 'Dự án' },
    { href: '/blogs', label: 'Blog' },
];

export function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80">
            <Container className="py-3">
                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        onClick={() => setMobileOpen((v) => !v)}
                        className="inline-flex md:hidden items-center justify-center rounded-full p-2 text-slate-700 hover:bg-emerald-100/80 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
                        aria-label="Mở menu"
                        aria-expanded={mobileOpen}
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="size-5"
                        >
                            {mobileOpen ? (
                                <>
                                    <path d="M18 6L6 18" />
                                    <path d="M6 6l12 12" />
                                </>
                            ) : (
                                <>
                                    <path d="M3 6h18" />
                                    <path d="M3 12h18" />
                                    <path d="M3 18h18" />
                                </>
                            )}
                        </svg>
                    </button>

                    <Link href="/" className="flex items-center gap-2 mr-6">
                        <span className="inline-flex size-9 items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white dark:bg-emerald-500 dark:text-white">
                            F
                        </span>
                        <span className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                            Floring
                        </span>
                    </Link>


                    <div className="hidden flex-1 items-center justify-center gap-8 md:flex">
                        <nav className="flex items-center gap-7">
                            <Link
                                href="/about"
                                className="group relative text-sm font-medium text-slate-700 transition-colors hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300"
                            >
                                Giới thiệu
                                <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-emerald-600 transition-all group-hover:w-full dark:bg-emerald-400" />
                            </Link>

                            <ServicesDropdown />

                            {navItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="group relative text-sm font-medium text-slate-700 transition-colors hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300"
                                >
                                    {item.label}
                                    <span className="pointer-events-none absolute -bottom-1 left-0 h-px w-0 bg-emerald-600 transition-all group-hover:w-full dark:bg-emerald-400" />
                                </Link>
                            ))}
                        </nav>

                        <HeaderSearch />
                    </div>


                    <div className="ml-auto flex items-center gap-1">
                        <ContactDropdown />

                        <Link
                            href="/favorites"
                            aria-label="Yêu thích"
                            className="rounded-full p-2 text-slate-700 hover:bg-emerald-100/80 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="size-5"
                            >
                                <path d="M19.5 12.1L12 19.6l-7.5-7.5a5.2 5.2 0 0 1 0-7.4 5.2 5.2 0 0 1 7.4 0L12 4.8l.1-.1a5.2 5.2 0 0 1 7.4 0 5.2 5.2 0 0 1 0 7.4Z" />
                            </svg>
                        </Link>
                    </div>
                </div>

                {mobileOpen ? (
                    <div className="mt-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:hidden dark:border-slate-800 dark:bg-slate-950">
                        <nav className="grid gap-1">
                            <Link
                                href="/about"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/50"
                            >
                                Giới thiệu
                            </Link>
                            <Link
                                href="/projects"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/50"
                            >
                                Dự án
                            </Link>
                            <Link
                                href="/blogs"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/50"
                            >
                                Blog
                            </Link>
                            <Link
                                href="/contact"
                                onClick={() => setMobileOpen(false)}
                                className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900/50"
                            >
                                Liên hệ
                            </Link>
                        </nav>
                    </div>
                ) : null}
            </Container>
        </header>
    );
}

