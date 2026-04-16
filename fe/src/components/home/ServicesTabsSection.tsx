'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type { HomeService } from '@/types/home';
import { normalizeImageUrl } from '@/lib/asset';

export function ServicesTabsSection({
    services,
    className,
}: {
    services: HomeService[];
    className?: string;
}) {
    const items = useMemo(() => services.slice(0, 2), [services]);
    const [activeIdx, setActiveIdx] = useState(0);
    const [isSwitching, setIsSwitching] = useState(false);
    const firstMountRef = useRef(true);

    useEffect(() => {
        setActiveIdx((idx) => {
            const maxIdx = Math.max(items.length - 1, 0);
            return Math.min(Math.max(idx, 0), maxIdx);
        });
    }, [items.length]);

    useEffect(() => {
        if (firstMountRef.current) {
            firstMountRef.current = false;
            return;
        }

        setIsSwitching(true);
        const t = window.setTimeout(() => setIsSwitching(false), 160);
        return () => window.clearTimeout(t);
    }, [activeIdx]);

    const active = items[activeIdx];
    const other = items.length > 1 ? items[activeIdx === 0 ? 1 : 0] : null;
    const panelId = 'services-tabs-panel';
    const activeImageUrl = active?.imageUrl ? normalizeImageUrl(active.imageUrl) : null;

    if (!active) return null;

    return (
        <div className={className}>
            <div className="relative">
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-16 left-1/3 h-72 w-72 rounded-full bg-emerald-200/14 blur-3xl" />
                    <div className="absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-amber-200/12 blur-3xl" />
                </div>

                <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur">
                    {activeImageUrl ? (
                        <>
                            <div className="absolute inset-0">
                                <Image
                                    src={activeImageUrl}
                                    alt={active.name}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_25%,rgba(255,255,255,0.16),transparent_50%),linear-gradient(180deg,rgba(17,24,39,0.14)_0%,rgba(17,24,39,0.26)_35%,rgba(17,24,39,0.52)_100%)]" />
                        </>
                    ) : null}

                    <div className="p-4 sm:p-6">
                        <div
                            className="relative grid h-12 grid-cols-2 overflow-hidden rounded-full border border-white/15 bg-white/10 p-1 shadow-inner shadow-black/10"
                            role="tablist"
                            aria-label="Select service package"
                        >
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-y-1 left-1 rounded-full bg-white/90 shadow-[0_12px_28px_-18px_rgba(255,255,255,0.95)] transition-transform duration-300 ease-out"
                                style={{
                                    width: `calc(${100 / items.length}% - 0.5rem)`,
                                    transform: `translateX(${activeIdx * 100}%)`,
                                }}
                            />
                            {items.map((s, idx) => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setActiveIdx(idx)}
                                    role="tab"
                                    aria-selected={idx === activeIdx}
                                    aria-controls={panelId}
                                    aria-label={s.name}
                                    id={`services-tab-${idx}`}
                                    className={[
                                        'relative z-10 rounded-full px-4 py-3 text-center text-sm font-semibold text-transparent transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40',
                                        idx === activeIdx ? 'text-transparent' : 'text-transparent',
                                    ].join(' ')}
                                />
                            ))}
                        </div>
                    </div>

                    <div
                        id={panelId}
                        role="tabpanel"
                        aria-labelledby={`services-tab-${activeIdx}`}
                        className={`relative flex-1 overflow-hidden rounded-[1.75rem] p-6 pt-0 sm:p-8 sm:pt-0 transition-opacity duration-150 ${
                            isSwitching ? 'opacity-0' : 'opacity-100'
                        }`}
                    >
                        {activeImageUrl ? null : (
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.10),transparent_45%),linear-gradient(135deg,rgba(255,255,255,0.10),rgba(255,255,255,0.04))]" />
                        )}

                        <div className="relative mx-auto flex min-h-[240px] max-w-3xl flex-col items-center justify-center text-center">
                            <div className="rounded-[1.75rem] border border-white/14 bg-black/15 px-6 py-7 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.75)] backdrop-blur-md sm:px-10">
                                <h3 className="mb-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                    {active.name}
                                </h3>

                                <div className="flex flex-wrap items-center justify-center gap-4">
                                    <Link
                                        href={`/services/${active.slug}`}
                                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-emerald-700 hover:shadow-[0_18px_40px_-18px_rgba(16,185,129,0.7)]"
                                    >
                                        Learn more
                                        <span className="inline-block">→</span>
                                    </Link>

                                    {other ? (
                                        <Link
                                            href={`/services/${other.slug}`}
                                            className="inline-flex items-center justify-center rounded-lg border border-white/18 bg-white/14 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-white/20"
                                        >
                                            View the other service
                                        </Link>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

