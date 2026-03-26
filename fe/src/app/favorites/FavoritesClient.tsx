'use client';

import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { favoritesApi } from '@/api';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Container } from '@/components/Container';
import { backendGet } from '@/lib/backend';
import { normalizeImageUrl } from '@/lib/asset';

type ApiProduct = {
  id: string;
  title: string;
  permalink?: string | null;
  image?: string | null;
  currentVariant?: {
    id: string;
    primaryImage?: string | null;
    image?: string | null;
    swatchImage?: string | null;
    title?: string | null;
  } | null;
};

type ProductBySlugResponse = {
  data: { products: ApiProduct[] };
};

const getCover = (p: ApiProduct) =>
  p.currentVariant?.primaryImage ||
  p.currentVariant?.image ||
  p.currentVariant?.swatchImage ||
  p.image ||
  null;

export default function FavoritesClient() {
  const router = useRouter();
  const [permalinks, setPermalinks] = useState<string[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const uniquePermalinks = useMemo(() => {
    const set = new Set(permalinks.map((x) => x.trim()).filter(Boolean));
    return Array.from(set);
  }, [permalinks]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await favoritesApi.getFavoritePermalinks();
        if (cancelled) return;
        setPermalinks(res.data.permalinks);
      } catch {
        if (cancelled) return;
        setPermalinks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      setProducts([]);
      if (!uniquePermalinks.length) return;

      const fetched = await Promise.all(
        uniquePermalinks.map(async (slug) => {
          const res = await backendGet<ProductBySlugResponse>(`/product/by-slug/${slug}`).catch(() => null);
          return res?.data?.products?.[0] ?? null;
        }),
      );

      if (cancelled) return;
      setProducts(fetched.filter((p): p is ApiProduct => !!p && !!p.id));
    }

    void loadProducts();
    return () => {
      cancelled = true;
    };
  }, [uniquePermalinks]);

  const toggleRemove = async (permalink: string) => {
    try {
      const res = await favoritesApi.toggleFavorite(permalink);
      const nextIsFav = res.data.isFavorite;

      setPermalinks((prev) => {
        const next = new Set(prev);
        if (nextIsFav) next.add(permalink);
        else next.delete(permalink);
        return Array.from(next);
      });

      setProducts((prev) => prev.filter((p) => p.permalink !== permalink));
    } catch {
      // keep UI unchanged on errors (not authenticated, redis down, etc.)
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-zinc-200 bg-white py-10">
        <Container>
          <Breadcrumbs items={[{ label: 'Trang chủ', href: '/' }, { label: 'Yêu thích' }]} />
          <header className="mt-6">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">Yêu thích</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Danh sách sản phẩm bạn đã lưu (tự hết hạn sau 1 tháng).
            </p>
          </header>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div className="h-44 w-full animate-pulse rounded-xl bg-zinc-100" />
                  <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
                  <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-zinc-100" />
                </div>
              ))}
            </div>
          ) : products.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => {
                const cover = getCover(p);
                const slug = p.permalink ?? '';
                const href = p.permalink ? `/products/${p.permalink}` : null;

                return (
                  <article
                    key={p.id}
                    className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
                    role="link"
                    tabIndex={0}
                    aria-label={p.title}
                    onClick={() => {
                      if (!href) return;
                      router.push(href);
                    }}
                    onKeyDown={(e) => {
                      if (!href) return;
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        router.push(href);
                      }
                    }}
                  >
                    <div className="relative aspect-[4/3] bg-zinc-100">
                      {cover ? (
                        <Image
                          src={normalizeImageUrl(cover)}
                          alt={p.title}
                          fill
                          className="object-cover transition group-hover:scale-[1.03]"
                          unoptimized
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-50" />
                      )}

                      <button
                        type="button"
                        aria-label="Bỏ yêu thích"
                        title="Bỏ yêu thích"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (!slug) return;
                          void toggleRemove(slug);
                        }}
                        className="absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full border border-rose-200 bg-rose-50/80 text-rose-600 shadow-sm backdrop-blur transition hover:bg-white"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="size-5" aria-hidden="true">
                          <path d="M19.5 12.1L12 19.6l-7.5-7.5a5.2 5.2 0 0 1 0-7.4 5.2 5.2 0 0 1 7.4 0L12 4.8l.1-.1a5.2 5.2 0 0 1 7.4 0 5.2 5.2 0 0 1 0 7.4Z" />
                        </svg>
                      </button>
                    </div>

                    <div className="p-5">
                      <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-zinc-900">{p.title}</h3>
                      {p.permalink ? (
                        <div className="mt-4 text-sm font-semibold text-zinc-600">
                          {p.title}
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
              <div className="text-sm text-zinc-700">Chưa có sản phẩm yêu thích.</div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                >
                  Về trang chủ
                </Link>
                <Link
                  href="/search"
                  className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
                >
                  Tìm sản phẩm
                </Link>
              </div>
            </div>
          )}
        </Container>
      </section>
    </main>
  );
}

