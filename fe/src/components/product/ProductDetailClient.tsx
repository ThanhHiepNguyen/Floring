'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';

import { Container } from '@/components/Container';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ServiceContactRequestForm } from '@/components/service/ServiceContactRequestForm';

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
    const railRef = useRef<HTMLDivElement | null>(null);
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

    const scrollRail = (dir: -1 | 1) => {
        const el = railRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * Math.max(260, Math.floor(el.clientWidth * 0.85)), behavior: 'smooth' });
    };

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
                <div className="relative aspect-[16/7] w-full overflow-hidden bg-zinc-900">
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

                                <div className="hidden items-center gap-2 md:flex">
                                    <button
                                        type="button"
                                        onClick={() => scrollRail(-1)}
                                        className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-2 text-zinc-700 shadow-sm hover:bg-zinc-50"
                                        aria-label="Trượt sang trái"
                                    >
                                        ‹
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => scrollRail(1)}
                                        className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white p-2 text-zinc-700 shadow-sm hover:bg-zinc-50"
                                        aria-label="Trượt sang phải"
                                    >
                                        ›
                                    </button>
                                </div>
                            </div>

                            <div ref={railRef} className="mt-6 flex gap-4 overflow-x-auto pb-2">
                                {relatedProducts.map((p) => {
                                    const v = p.currentVariant ?? p.variants?.[0] ?? null;
                                    const img = v?.primaryImage || v?.swatchImage || v?.image || p.image || null;
                                    const href = p.permalink ? `/products/${p.permalink}` : '#';
                                    return (
                                        <Link
                                            key={p.id}
                                            href={href}
                                            className="min-w-[220px] flex-shrink-0 rounded-xl border border-zinc-200 bg-white p-3 transition hover:border-zinc-300"
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
                    ) : null}
                </Container>
            </section>
        </main>
    );
}

