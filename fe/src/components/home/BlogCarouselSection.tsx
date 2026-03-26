'use client';

import { useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type BlogCard = {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    imageUrl?: string | null;
    createdAt?: string;
    author?: string;
    category?: string;
};

export function BlogCarouselSection({
    posts,
    className,
}: {
    posts: BlogCard[];
    className?: string;
}) {
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    const canScroll = posts.length > 1;

    const formatDate = (iso?: string) => {
        if (!iso) return null;
        const d = new Date(iso);
        if (Number.isNaN(d.getTime())) return null;
        return new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(d);
    };

    const scrollByCards = (dir: -1 | 1) => {
        const el = scrollerRef.current;
        if (!el) return;

        // Scroll ~1 card width (responsive) + gap
        const w = el.clientWidth;
        const delta = Math.max(300, Math.round(w * 0.72));
        el.scrollBy({ left: dir * delta, behavior: 'smooth' });
    };

    const visible = useMemo(() => posts, [posts]);

    return (
        <div className={className}>
            <div className="group relative mt-12 md:px-14">
                {/* Prev / Next */}
                {canScroll ? (
                    <>
                        <button
                            type="button"
                            onClick={() => scrollByCards(-1)}
                            className="hidden md:inline-flex absolute left-2 top-1/2 z-20 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/80 text-zinc-800 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.45)] backdrop-blur transition-all duration-300 ease-out hover:bg-white hover:text-emerald-700 hover:shadow-[0_26px_80px_-40px_rgba(0,0,0,0.5)] hover:scale-[1.03] active:scale-[0.97] opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-visible:opacity-100 focus-visible:visible focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                            aria-label="Previous"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    d="M15 18L9 12L15 6"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollByCards(1)}
                            className="hidden md:inline-flex absolute right-2 top-1/2 z-20 h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/80 text-zinc-800 shadow-[0_18px_60px_-35px_rgba(0,0,0,0.45)] backdrop-blur transition-all duration-300 ease-out hover:bg-white hover:text-emerald-700 hover:shadow-[0_26px_80px_-40px_rgba(0,0,0,0.5)] hover:scale-[1.03] active:scale-[0.97] opacity-0 invisible group-hover:opacity-100 group-hover:visible focus-visible:opacity-100 focus-visible:visible focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                            aria-label="Next"
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    d="M9 6L15 12L9 18"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    </>
                ) : null}

                <div
                    ref={scrollerRef}
                    className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-3 md:px-0"
                >
                    {visible.map((p) => (
                        <article
                            key={p.id}
                            className="snap-start shrink-0 basis-[85%] sm:basis-[60%] md:basis-[44%] lg:basis-[calc((100%_-_3rem)/3)]"
                        >
                            <Link
                                href={`/blogs/${p.slug}`}
                                className="group block overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
                            >
                                <div className="relative m-5 overflow-hidden rounded-xl bg-zinc-100">
                                    <div className="relative aspect-[16/9]">
                                        {p.imageUrl ? (
                                            <Image
                                                src={p.imageUrl}
                                                alt={p.title}
                                                fill
                                                className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                                                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 33vw"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className="absolute inset-0 bg-zinc-200" />
                                        )}

                                        {/* Category pill removed per request */}

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </div>
                                </div>

                                <div className="px-6 pb-6">
                                    {/* Meta row */}
                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500">
                                        <div className="inline-flex items-center gap-2">
                                            <span aria-hidden="true">📅</span>
                                            <span>{formatDate(p.createdAt) ?? '—'}</span>
                                        </div>
                                        <div className="inline-flex items-center gap-2">
                                            <span aria-hidden="true">👤</span>
                                            <span>By {p.author || 'Floring'}</span>
                                        </div>
                                    </div>

                                    <h3 className="mt-4 line-clamp-2 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">
                                        {p.title}
                                    </h3>
                                    {p.excerpt ? (
                                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
                                            {p.excerpt}
                                        </p>
                                    ) : null}

                                    <div className="mt-5">
                                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600">
                                            <span className="underline decoration-transparent underline-offset-4 transition-colors duration-300 group-hover:decoration-indigo-600">
                                                Xem thêm
                                            </span>
                                            <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
                                                ››
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
}

