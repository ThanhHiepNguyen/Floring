'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { api } from '@/api/http';
import { Container } from '@/components/Container';
import { HeaderSearch } from '@/components/HeaderSearch';
import { ServicesDropdown } from '@/components/nav/ServicesDropdown';
import { ContactDropdown } from '@/components/nav/ContactDropdown';
import { ServiceContactRequestForm } from '@/components/service/ServiceContactRequestForm';

const navItems = [
    { href: '/projects', label: 'Projects' },
    { href: '/blogs', label: 'Blog' },
];

const mobileNavItems = [
    { href: '/about', label: 'About' },
    { href: '/projects', label: 'Projects' },
    { href: '/blogs', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
];

type ServiceItem = {
    id: string;
    name: string;
    slug: string;
};

export function Header() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
    const [mobileServices, setMobileServices] = useState<ServiceItem[]>([]);

    useEffect(() => {
        let cancelled = false;
        const controller = new AbortController();

        (async () => {
            try {
                const res = await api.get<{ data?: ServiceItem[] }>('/service', {
                    params: { page: 1, limit: 50 },
                    signal: controller.signal,
                });
                const data = Array.isArray(res.data?.data) ? res.data.data : [];
                if (!cancelled) {
                    setMobileServices(data.sort((a, b) => a.name.localeCompare(b.name)));
                }
            } catch {
                if (!cancelled) setMobileServices([]);
            }
        })();

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, []);

    useEffect(() => {
        setMobileOpen(false);
        setMobileServicesOpen(false);
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80">
            <Container className="py-3">
                <div className="flex items-center gap-6">
                    <button
                        type="button"
                        onClick={() => setMobileOpen((v) => !v)}
                        className="inline-flex md:hidden items-center justify-center rounded-full p-2 text-slate-700 hover:bg-emerald-100/80 hover:text-emerald-700 dark:text-slate-300 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300"
                        aria-label="Open menu"
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

                    <Link href="/" className="mr-6 flex items-center gap-2.5">
                        <span className="inline-flex size-9 items-center justify-center overflow-hidden rounded-xl shadow-sm ring-1 ring-emerald-100">
                            <Image
                                src="/logo-mark.svg"
                                alt="Floring logo"
                                width={36}
                                height={36}
                                className="size-9 object-cover"
                                priority
                            />
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
                                About
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
                            aria-label="Favorites"
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
                        <div className="mb-2 px-1">
                            <HeaderSearch mobile onSubmitComplete={() => setMobileOpen(false)} />
                        </div>
                        <nav className="flex flex-col gap-1 px-1 py-1">
                            {mobileNavItems.map((item) => (
                                <div key={item.href}>
                                    {item.href === '/contact' ? (
                                        <ServiceContactRequestForm
                                            mode="dialog"
                                            serviceId={null}
                                            serviceName={null}
                                            productVariantId={null}
                                            triggerLabel={item.label}
                                            triggerVariant="form"
                                            triggerClassName="group relative rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-300"
                                        />
                                    ) : (
                                        <Link
                                            href={item.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="group relative rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-300"
                                        >
                                            {item.label}
                                            <span className="pointer-events-none absolute -bottom-0.5 left-3 h-px w-0 bg-emerald-600 transition-all group-hover:w-10 dark:bg-emerald-400" />
                                        </Link>
                                    )}

                                    {item.href === '/about' ? (
                                        <div className="mt-0.5 pl-3">
                                            <button
                                                type="button"
                                                onClick={() => setMobileServicesOpen((v) => !v)}
                                                className="group relative inline-flex items-center gap-2 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:text-emerald-700 dark:text-slate-200 dark:hover:text-emerald-300"
                                            >
                                                <span>Services</span>
                                                <span className="text-xs">{mobileServicesOpen ? '▴' : '▾'}</span>
                                                <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-0 bg-emerald-600 transition-all group-hover:w-10 dark:bg-emerald-400" />
                                            </button>

                                            {mobileServicesOpen ? (
                                                <div className="mt-1 grid gap-1 pb-1 pl-2">
                                                    {mobileServices.map((service) => (
                                                        <Link
                                                            key={service.id}
                                                            href={`/services/${service.slug}`}
                                                            onClick={() => setMobileOpen(false)}
                                                            className="group relative rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-300"
                                                        >
                                                            {service.name}
                                                            <span className="pointer-events-none absolute -bottom-0.5 left-2 h-px w-0 bg-emerald-600 transition-all group-hover:w-8 dark:bg-emerald-400" />
                                                        </Link>
                                                    ))}
                                                </div>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </div>
                            ))}
                        </nav>
                    </div>
                ) : null}
            </Container>
        </header>
    );
}

