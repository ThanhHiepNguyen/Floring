'use client';

import { useMemo, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { normalizeImageUrl } from '@/lib/asset';

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
            <div className="group relative md:px-10">
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
                    className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-3 md:px-0"
                >
                    {visible.map((p) => (
                        <article
                            key={p.id}
                            className="snap-start shrink-0 basis-[86%] sm:basis-[58%] md:basis-[46%] lg:basis-[calc((100%_-_2.5rem)/3)]"
                        >
                            <Link
                                href={`/blogs/${p.slug}`}
                                className="group block h-full overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_10px_30px_-24px_rgba(2,6,23,0.35)] transition duration-300 ease-out hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_16px_38px_-22px_rgba(2,6,23,0.38)]"
                            >
                                <div className="relative m-4 overflow-hidden rounded-xl bg-zinc-100">
                                    <div className="relative aspect-[16/9]">
                                        {p.imageUrl ? (
                                            <Image
                                                src={normalizeImageUrl(p.imageUrl)}
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

                                <div className="px-5 pb-5">
                                    {/* Meta row */}
                                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
                                        <div className="inline-flex items-center gap-1.5">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="h-3.5 w-3.5 text-emerald-700/80"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M8 3v3M16 3v3M4 9h16M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span>{formatDate(p.createdAt) ?? '—'}</span>
                                        </div>
                                        <div className="inline-flex items-center gap-1.5">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="h-3.5 w-3.5 text-emerald-700/80"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 20a8 8 0 0 1 16 0"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                            <span>By {p.author || 'Floring'}</span>
                                        </div>
                                    </div>

                                    <h3 className="mt-3 line-clamp-2 text-[1.65rem] font-semibold leading-tight tracking-tight text-zinc-900">
                                        {p.title}
                                    </h3>
                                    {p.excerpt ? (
                                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
                                            {p.excerpt}
                                        </p>
                                    ) : null}

                                    <div className="mt-4">
                                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                            <span className="underline decoration-transparent underline-offset-4 transition-colors duration-300 group-hover:decoration-emerald-700">
                                                Read more
                                            </span>
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M13 6l6 6-6 6M5 12h14"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
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

