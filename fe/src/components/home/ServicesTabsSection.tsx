'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import type { HomeService } from '@/types/home';

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
        // Tránh fade ở lần render đầu tiên, chỉ fade khi người dùng bấm đổi tab
        if (firstMountRef.current) {
            firstMountRef.current = false;
            return;
        }

        setIsSwitching(true);
        const t = window.setTimeout(() => setIsSwitching(false), 160);
        return () => window.clearTimeout(t);
    }, [activeIdx]);

    const active = items[activeIdx] ?? items[0];
    const other = items[activeIdx === 0 ? 1 : 0];
    const panelId = 'services-tabs-panel';

    if (!active) return null;

    return (
        <div className={className}>
            <div className="relative grid gap-8 lg:gap-8 lg:grid-cols-12 lg:items-center items-stretch">
                {/* Subtle background accents */}
                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div className="absolute -top-16 left-1/3 h-72 w-72 rounded-full bg-emerald-200/14 blur-3xl" />
                    <div className="absolute -bottom-20 right-1/4 h-80 w-80 rounded-full bg-amber-200/12 blur-3xl" />
                </div>
                {/* Visual */}
                <div className="lg:col-span-6">
                    <Link
                        href={`/services/${active.slug}`}
                        className="group block h-full"
                        aria-label={`Xem dịch vụ: ${active.name}`}
                    >
                        <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/60 backdrop-blur transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/90 hover:shadow-[0_12px_48px_-14px_rgba(0,0,0,0.12)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)]">
                            <div className="relative aspect-[16/11] bg-zinc-100">
                                {active.imageUrl ? (
                                    <Image
                                        src={active.imageUrl}
                                        alt={active.name}
                                        fill
                                        className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.045]"
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                        unoptimized
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-emerald-100" />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0" />
                                <div className="pointer-events-none absolute -top-16 -left-16 h-52 w-52 rounded-full bg-white/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Content */}
                <div className="lg:col-span-6">
                    {/* Tabs */}
                    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/60 bg-white/85 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] backdrop-blur">
                        <div className="p-4 sm:p-6">
                            <div
                                className="grid grid-cols-2 gap-2 rounded-2xl bg-[#F3F4F6] p-1"
                                role="tablist"
                                aria-label="Chọn gói dịch vụ"
                            >
                                {[items[0], items[1]].map((s, idx) => (
                                    <button
                                        key={s?.id ?? idx}
                                        type="button"
                                        disabled={!s}
                                        onClick={() => setActiveIdx(idx)}
                                        role="tab"
                                        aria-selected={idx === activeIdx}
                                        aria-controls={panelId}
                                        id={`services-tab-${idx}`}
                                        className={[
                                            'rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white/90',
                                            idx === activeIdx
                                                ? 'bg-white text-zinc-900 shadow-[0_2px_8px_rgba(0,0,0,0.05)]'
                                                : 'bg-transparent text-[#6B7280] hover:bg-white/70',
                                            !s ? 'opacity-50 cursor-not-allowed' : '',
                                        ].join(' ')}
                                    >

                                        <div className="mt-1 line-clamp-1">
                                            {s?.name ?? (idx === 0 ? 'Dịch vụ 1' : 'Dịch vụ 2')}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div
                            id={panelId}
                            role="tabpanel"
                            aria-labelledby={`services-tab-${activeIdx}`}
                            className={`flex-1 min-h-[220px] p-6 sm:p-8 pt-0 transition-opacity duration-150 ${isSwitching ? 'opacity-0' : 'opacity-100'}`}
                        >
                            <h3 className="mb-4 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                                {active.name}
                            </h3>
                            <p className="mb-6 max-w-prose text-sm leading-[1.7] text-[#4B5563]">
                                {active.description ||
                                    'Xem chi tiết dịch vụ và các tuỳ chọn phù hợp cho không gian của bạn.'}
                            </p>

                            <div className="flex flex-wrap items-center gap-4">
                                <Link
                                    href={`/services/${active.slug}`}
                                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-emerald-700 hover:shadow-[0_18px_40px_-18px_rgba(16,185,129,0.7)]"
                                >
                                    Tìm hiểu thêm
                                    <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-0.5">
                                        →
                                    </span>
                                </Link>

                                {other ? (
                                    <Link
                                        href={`/services/${other.slug}`}
                                        className="inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all duration-300 hover:bg-[#F3F4F6]"
                                    >
                                        Xem dịch vụ còn lại
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

