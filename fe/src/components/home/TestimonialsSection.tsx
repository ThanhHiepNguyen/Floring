'use client';

import { useMemo, useState } from 'react';

import type { Testimonial } from '@/types/home';

export function TestimonialsSection({
    testimonials,
    initialCount = 3,
}: {
    testimonials: Testimonial[];
    initialCount?: number;
}) {
    const [showAll, setShowAll] = useState(false);

    const visible = useMemo(() => {
        if (showAll) return testimonials;
        return testimonials.slice(0, initialCount);
    }, [showAll, testimonials, initialCount]);

    const canShowMore = testimonials.length > initialCount;

    return (
        <>
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
                {visible.map((t) => (
                    <article
                        key={t.name}
                        className="rounded-3xl border border-zinc-200/60 bg-white/80 p-8 shadow-sm backdrop-blur"
                    >
                        <div className="flex items-center gap-1 text-lg text-amber-500" aria-label="Rating: 5 stars">
                            {Array.from({ length: 5 }).map((_, idx) => (
                                <span key={`${t.name}-star-${idx}`} aria-hidden="true">
                                    ★
                                </span>
                            ))}
                        </div>
                        <p className="mt-4 text-sm leading-7 text-zinc-600">“{t.quote}”</p>
                        <div className="mt-6">
                            <div className="text-sm font-semibold text-zinc-900">{t.name}</div>
                            <div className="text-xs text-zinc-500">{t.role}</div>
                        </div>
                    </article>
                ))}
            </div>

            {canShowMore ? (
                <div className="mt-8 flex justify-center">
                    <button
                        type="button"
                        onClick={() => setShowAll((v) => !v)}
                        className="rounded-full border border-zinc-200 bg-white px-6 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
                    >
                        {showAll ? 'Show less' : 'Show more'}
                    </button>
                </div>
            ) : null}
        </>
    );
}

