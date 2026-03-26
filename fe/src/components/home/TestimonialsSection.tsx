'use client';

import { useMemo } from 'react';

import type { Testimonial } from '@/types/home';

function initialsFromName(name: string) {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] ?? '';
    const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? '' : '';
    return (first + last).toUpperCase();
}

function hashToPalette(name: string) {
    let h = 0;
    for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
    const palettes = [
        'from-emerald-500 to-teal-500',
        'from-indigo-500 to-violet-500',
        'from-amber-500 to-orange-500',
        'from-cyan-500 to-sky-500',
        'from-rose-500 to-pink-500',
        'from-lime-500 to-emerald-500',
    ];
    return palettes[h % palettes.length];
}

export function TestimonialsSection({
    testimonials,
    initialCount = 3,
}: {
    testimonials: Testimonial[];
    initialCount?: number;
}) {
    const visible = useMemo(() => {
        return testimonials.slice(0, initialCount);
    }, [testimonials, initialCount]);

    const doubled = useMemo(() => [...visible, ...visible], [visible]);
    const durationSec = Math.max(20, visible.length * 6);

    return (
        <>
            <div className="mt-12 overflow-hidden">
                <div
                    className="flex w-max flex-nowrap gap-6"
                    style={{
                        animation: `marquee ${durationSec}s linear infinite`,
                        willChange: 'transform',
                    }}
                >
                    {doubled.map((t, idx) => (
                        <article
                            key={`${t.name}-${idx}`}
                            className="w-[320px] flex-shrink-0 rounded-3xl border border-zinc-200/60 bg-white/80 p-8 shadow-sm backdrop-blur sm:w-[360px]"
                        >
                            <div className="mb-5 flex items-center gap-3">
                                <div
                                    className={[
                                        'h-11 w-11 rounded-full bg-gradient-to-br',
                                        hashToPalette(t.name),
                                        'text-white shadow-sm',
                                        'flex items-center justify-center',
                                        'font-semibold tracking-tight',
                                    ].join(' ')}
                                    aria-hidden="true"
                                >
                                    {initialsFromName(t.name)}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-zinc-900">{t.name}</div>
                                    <div className="text-xs text-zinc-500">{t.role}</div>
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-1 text-lg text-amber-500"
                                aria-label="Rating: 5 stars"
                            >
                                {Array.from({ length: 5 }).map((_, starIdx) => (
                                    <span
                                        key={`${t.name}-star-${idx}-${starIdx}`}
                                        aria-hidden="true"
                                    >
                                        ★
                                    </span>
                                ))}
                            </div>
                            <p className="mt-4 text-sm leading-7 text-zinc-600">“{t.quote}”</p>
                        </article>
                    ))}
                </div>
            </div>

        </>
    );
}

