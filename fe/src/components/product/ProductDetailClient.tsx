'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Container } from '@/components/Container';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ServiceContactRequestForm } from '@/components/service/ServiceContactRequestForm';
import { favoritesApi } from '@/api';

type ProductVariant = {
    id: string;
    title: string;
    primaryImage?: string | null;
    swatchImage?: string | null;
    image?: string | null;
};

type Product = {
    id: string;
    title: string;
    description?: string | null;
    image?: string | null;
    permalink?: string | null;
    serviceId?: string | null;
    serviceName?: string | null;
    currentVariant?: ProductVariant | null;
    variants: ProductVariant[];
};

export function ProductDetailClient({
    product,
    relatedProducts,
}: {
    product: Product;
    relatedProducts?: Product[];
}) {
    const [isRelatedPaused, setIsRelatedPaused] = useState(false);
    const [favoritePermalinks, setFavoritePermalinks] = useState<Set<string>>(new Set());
    const [togglingPermalink, setTogglingPermalink] = useState<string | null>(null);
    const initialVariantId =
        product.currentVariant?.id ?? product.variants?.[0]?.id ?? null;
    const [selectedVariantId, setSelectedVariantId] = useState<string | null>(initialVariantId);

    const selectedVariant = useMemo(() => {
        return product.variants.find((v) => v.id === selectedVariantId) ?? product.variants[0] ?? null;
    }, [product.variants, selectedVariantId]);

    const heroImage =
        selectedVariant?.primaryImage ||
        selectedVariant?.image ||
        product.image ||
        '';

    const serviceId = product.serviceId ?? null;

    const permalink = product.permalink ?? null;
    const isFav = !!permalink && favoritePermalinks.has(permalink);

    const relatedVisible = useMemo(() => relatedProducts ?? [], [relatedProducts]);
    const relatedDoubled = useMemo(() => {
        if (relatedVisible.length <= 1) return relatedVisible;
        return [...relatedVisible, ...relatedVisible];
    }, [relatedVisible]);
    const relatedDurationSec = useMemo(() => {
        // tốc độ tương tự section "Khách hàng chia sẻ": ít item thì vẫn mượt, nhiều item thì không quá nhanh
        return Math.max(18, relatedVisible.length * 3.8);
    }, [relatedVisible.length]);

    useEffect(() => {
        let cancelled = false;

        async function loadFavorites() {
            try {
                const res = await favoritesApi.getFavoritePermalinks();
                if (cancelled) return;
                setFavoritePermalinks(new Set(res.data.permalinks));
            } catch {
                if (cancelled) return;
                setFavoritePermalinks(new Set());
            }
        }

        void loadFavorites();
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <main className="min-h-screen bg-background text-foreground">
            <section className="border-b border-zinc-200 bg-white py-6">
                <Container>
                    <Breadcrumbs
                        items={[
                            { label: 'Trang chủ', href: '/' },
                            { label: 'Sản phẩm' },
                            { label: product.title },
                        ]}
                    />
                </Container>
            </section>

            <section className="relative">
                <div className="group relative aspect-[16/7] w-full overflow-hidden bg-zinc-900">
                    {heroImage ? (
                        <Image
                            src={heroImage}
                            alt={selectedVariant?.title ?? product.title}
                            fill
                            priority
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_rgba(255,255,255,0)_35%),linear-gradient(135deg,#18181b_0%,#27272a_45%,#3f3f46_100%)]" />
                    )}

                    <div className="absolute inset-0 bg-black/45" />
                    {permalink ? (
                        <button
                            type="button"
                            aria-label={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
                            title={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
                            onClick={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (togglingPermalink === permalink) return;
                                setTogglingPermalink(permalink);
                                try {
                                    const res = await favoritesApi.toggleFavorite(permalink);
                                    const nextIsFav = res.data.isFavorite;
                                    setFavoritePermalinks((prev) => {
                                        const next = new Set(prev);
                                        if (nextIsFav) next.add(permalink);
                                        else next.delete(permalink);
                                        return next;
                                    });
                                } catch {
                                    // keep UI unchanged if request fails
                                } finally {
                                    setTogglingPermalink(null);
                                }
                            }}
                            className={[
                                'absolute right-4 top-4 z-[11] inline-flex size-10 items-center justify-center rounded-full border bg-white/85 shadow-sm backdrop-blur transition',
                                'opacity-0 group-hover:opacity-100',
                                isFav ? 'border-rose-200 text-rose-600 bg-rose-50/80' : 'border-zinc-200 text-zinc-700 hover:bg-white',
                            ].join(' ')}
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill={isFav ? 'currentColor' : 'none'}
                                stroke="currentColor"
                                strokeWidth="2"
                                className="size-5"
                                aria-hidden="true"
                            >
                                <path d="M19.5 12.1L12 19.6l-7.5-7.5a5.2 5.2 0 0 1 0-7.4 5.2 5.2 0 0 1 7.4 0L12 4.8l.1-.1a5.2 5.2 0 0 1 7.4 0 5.2 5.2 0 0 1 0 7.4Z" />
                            </svg>
                        </button>
                    ) : null}
                    <div className="absolute inset-0 z-10 flex items-center justify-center p-6 text-center">
                        <div className="max-w-4xl">
                            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
                                {product.title}
                            </h1>
                            {selectedVariant?.title ? (
                                <p className="mt-3 text-base leading-7 text-white/90 sm:text-lg">
                                    {selectedVariant.title}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-10">
                <Container>
                    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                            <div className="min-w-0 flex-1">
                                <h2 className="text-2xl font-semibold text-zinc-900">Chọn màu</h2>
                                {product.description ? (
                                    <p className="mt-2 text-sm leading-relaxed text-zinc-600">{product.description}</p>
                                ) : null}
                            </div>

                            {serviceId ? (
                                <ServiceContactRequestForm
                                    serviceId={serviceId}
                                    serviceName={product.serviceName ?? ''}
                                    productVariantId={selectedVariantId}
                                    mode="dialog"
                                    triggerLabel="Liên hệ"
                                    triggerClassName="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    triggerVariant="form"
                                />
                            ) : (
                                <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
                                    Chưa có thông tin service để gửi yêu cầu.
                                </div>
                            )}
                        </div>

                        <div className="mt-7 flex flex-wrap gap-3">
                            {product.variants.map((v) => {
                                const active = v.id === selectedVariantId;
                                const swatch = v.swatchImage || v.primaryImage || v.image;
                                return (
                                    <button
                                        key={v.id}
                                        type="button"
                                        onClick={() => setSelectedVariantId(v.id)}
                                        className={[
                                            'h-10 w-10 overflow-hidden rounded-full border transition',
                                            active ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-zinc-300 hover:border-zinc-500',
                                        ].join(' ')}
                                        aria-label={`Chọn: ${v.title}`}
                                        title={v.title}
                                    >
                                        {swatch ? (
                                            <Image src={swatch} alt={v.title} width={40} height={40} className="h-full w-full object-cover" unoptimized />
                                        ) : null}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-zinc-900">Các lựa chọn màu</h3>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {product.variants.map((v) => (
                                    <span
                                        key={v.id}
                                        className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700"
                                    >
                                        {v.title}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {relatedProducts && relatedProducts.length ? (
                        <div className="mt-12">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <h2 className="text-2xl font-semibold text-zinc-900">Sản phẩm cùng dịch vụ</h2>
                                    <p className="mt-1 text-sm text-zinc-600">Lướt ngang để xem thêm các mẫu.</p>
                                </div>
                            </div>

                            <div
                                className="mt-6 overflow-hidden pb-2"
                                onMouseEnter={() => setIsRelatedPaused(true)}
                                onMouseLeave={() => setIsRelatedPaused(false)}
                                onTouchStart={() => setIsRelatedPaused(true)}
                                onTouchEnd={() => setIsRelatedPaused(false)}
                            >
                                <div
                                    className="flex w-max flex-nowrap gap-4 motion-reduce:animate-none"
                                    style={{
                                        animation: `marquee ${relatedDurationSec}s linear infinite`,
                                        animationPlayState: isRelatedPaused ? 'paused' : 'running',
                                        willChange: 'transform',
                                    }}
                                >
                                    {relatedDoubled.map((p, idx) => {
                                        const v = p.currentVariant ?? p.variants?.[0] ?? null;
                                        const img = v?.primaryImage || v?.swatchImage || v?.image || p.image || null;
                                        const href = p.permalink ? `/products/${p.permalink}` : '#';
                                        return (
                                            <Link
                                                key={`${p.id}-${idx}`}
                                                href={href}
                                                className="w-[220px] flex-shrink-0 rounded-xl border border-zinc-200 bg-white p-3 transition hover:border-zinc-300"
                                            >
                                                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100">
                                                    {img ? (
                                                        <Image src={img} alt={p.title} fill className="object-cover" unoptimized />
                                                    ) : null}
                                                </div>
                                                <div className="mt-3">
                                                    <div className="line-clamp-2 text-sm font-semibold text-zinc-900">{p.title}</div>
                                                    {v?.title ? (
                                                        <div className="mt-1 text-xs text-zinc-500">Màu: {v.title}</div>
                                                    ) : null}
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : null}
                </Container>
            </section>
        </main>
    );
}

