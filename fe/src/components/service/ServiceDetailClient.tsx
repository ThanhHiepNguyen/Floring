'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Container } from '@/components/Container';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ServiceContactRequestForm } from '@/components/service/ServiceContactRequestForm';
import { favoritesApi } from '@/api';
import { normalizeImageUrl } from '@/lib/asset';

type Service = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
};

type ProductVariant = {
  id: string;
  title: string;
  image?: string | null;
  primaryImage?: string | null;
  swatchImage?: string | null;
  colour?: string | null;
  price?: number | null;
};

type ServiceProduct = {
  id: string;
  title: string;
  permalink?: string | null;
  description?: string | null;
  image?: string | null;
  brand?: string | null;
  style?: string | null;
  priceRange?: { minPrice?: number | null; maxPrice?: number | null } | null;
  currentVariant?: ProductVariant | null;
  variants: ProductVariant[];
};

type Props = {
  service: Service;
  products: ServiceProduct[];
};

function uniqVariants(list: ProductVariant[]) {
  const seen = new Set<string>();
  const out: ProductVariant[] = [];
  for (const item of list) {
    if (!item?.id || seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

export function ServiceDetailClient({ service, products }: Props) {
  const router = useRouter();
  const [favoritePermalinks, setFavoritePermalinks] = useState<Set<string>>(new Set());
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [togglingPermalink, setTogglingPermalink] = useState<string | null>(null);

  const initialSelectedId =
    products?.[0]?.currentVariant?.id ?? products?.[0]?.variants?.[0]?.id ?? null;
  const [selectedVariantId, setSelectedVariantId] =
    useState<string | null>(initialSelectedId);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name-asc' | 'name-desc'>('name-asc');

  useEffect(() => {
    let cancelled = false;

    async function loadFavorites() {
      setFavoritesLoading(true);
      try {
        const res = await favoritesApi.getFavoritePermalinks();
        if (cancelled) return;
        setFavoritePermalinks(new Set(res.data.permalinks));
      } catch {
        if (cancelled) return;
        // If not authenticated or favorites not available, keep set empty.
        setFavoritePermalinks(new Set());
      } finally {
        if (!cancelled) setFavoritesLoading(false);
      }
    }

    void loadFavorites();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = products.filter((item) => {
      const variantText = (item.variants || []).map((v) => v.title).join(' ').toLowerCase();
      const titleText = item.title.toLowerCase();
      if (q && !titleText.includes(q) && !variantText.includes(q)) return false;
      return true;
    });

    out.sort((a, b) => {
      const aPrice = a.currentVariant?.price ?? a.priceRange?.minPrice ?? 0;
      const bPrice = b.currentVariant?.price ?? b.priceRange?.minPrice ?? 0;
      if (sortBy === 'name-asc') return aPrice - bPrice;
      return bPrice - aPrice;
    });

    return out;
  }, [products, query, sortBy]);

  const selectedState = (() => {
    for (const p of products) {
      const all = uniqVariants([...(p.currentVariant ? [p.currentVariant] : []), ...(p.variants || [])]);
      const found = all.find((v) => v.id === selectedVariantId);
      if (found) return { product: p, variant: found };
    }
    return null;
  })();

  const heroImage =
    selectedState?.variant.primaryImage ||
    selectedState?.variant.image ||
    selectedState?.product.image ||
    service.imageUrl;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-zinc-200 bg-white py-6">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Dịch vụ' },
              { label: service.name },
            ]}
          />
        </Container>
      </section>

      <section className="relative">
        <div className="relative aspect-[16/7] w-full overflow-hidden bg-zinc-900">
          {heroImage ? (
            <Image
              src={normalizeImageUrl(heroImage)}
              alt={selectedState?.variant.title || service.name}
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
              <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
                {service.name}
              </h1>
              <p className="mt-4 text-base leading-7 text-white/90 sm:text-xl">
                {service.description}
              </p>

            </div>
          </div>
        </div>
      </section>

      <section className="relative py-10">
        <Container>
          <div className="grid gap-8">
            <div>
              <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative w-full md:flex-1">
                  <svg
                    className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by product or colour..."
                    className="w-full rounded-md border border-zinc-300 bg-white pl-9 pr-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  />
                </div>

                <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end md:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name-asc' | 'name-desc')}
                    className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:w-[220px]"
                  >
                    <option value="name-asc">Price: Low to high</option>
                    <option value="name-desc">Price: High to low</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      setSortBy('name-asc');
                    }}
                    className="rounded-md border border-zinc-300 bg-white px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.length ? (
                  filteredProducts.map((item) => {
                    const swatches = uniqVariants([
                      ...(item.currentVariant ? [item.currentVariant] : []),
                      ...(item.variants || []),
                    ]);
                    const selectedInCard =
                      swatches.find((v) => v.id === selectedVariantId) ??
                      swatches[0] ??
                      null;
                    const cardImage =
                      selectedInCard?.primaryImage ||
                      selectedInCard?.image ||
                      item.image ||
                      null;
                    const productHref = item.permalink ? `/products/${item.permalink}` : null;
                    const permalink = item.permalink ?? null;
                    const isFav = permalink ? favoritePermalinks.has(permalink) : false;

                    return (
                      <article
                        key={item.id}
                        className={[
                          'group overflow-hidden rounded-md border p-2 transition',
                          selectedInCard?.id === selectedVariantId
                            ? 'border-emerald-500 bg-emerald-50/40'
                            : 'border-zinc-200 bg-white',
                        ].join(' ')}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          className="block w-full cursor-pointer text-left"
                          onClick={() => {
                            if (productHref) router.push(productHref);
                          }}
                          onKeyDown={(e) => {
                            if ((e.key === 'Enter' || e.key === ' ') && productHref) {
                              e.preventDefault();
                              router.push(productHref);
                            }
                          }}
                        >
                          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-zinc-100">
                            {cardImage ? (
                              <Image
                                src={cardImage}
                                alt={item.title}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-50" />
                            )}

                          {permalink ? (
                            <button
                              type="button"
                              aria-label={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
                              title={isFav ? 'Bỏ yêu thích' : 'Yêu thích'}
                              onClick={async (e) => {
                                e.stopPropagation();
                                e.preventDefault();
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
                                  // keep UI unchanged if request fails (e.g. not authenticated)
                                } finally {
                                  setTogglingPermalink(null);
                                }
                              }}
                              className={[
                                'absolute right-2 top-2 z-20 inline-flex size-9 items-center justify-center rounded-full border bg-white/85 shadow-sm backdrop-blur transition',
                                'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-white',
                                isFav ? 'border-rose-200 text-rose-600 bg-rose-50/80' : 'border-zinc-200 text-zinc-700',
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

                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:opacity-100 group-hover:bg-black/35">
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="opacity-100"
                              >
                                <ServiceContactRequestForm
                                  serviceId={service.id}
                                  serviceName={service.name}
                                  productVariantId={selectedInCard?.id ?? selectedVariantId}
                                  mode="dialog"
                                  triggerLabel="Liên hệ"
                                  triggerClassName="rounded-md bg-white/90 px-3 py-1 text-sm font-semibold text-zinc-900 hover:bg-white"
                                  triggerVariant="form"
                                />
                              </div>
                            </div>
                          </div>

                          <h3 className="mt-2 line-clamp-2 text-[13px] font-medium text-zinc-900">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-[11px] text-zinc-500">Other colours in this range</p>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            {swatches.map((variant) => {
                              const active = variant.id === selectedVariantId;
                              const swatchUrl = variant.swatchImage || variant.image;
                              return (
                                <button
                                  key={variant.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedVariantId(variant.id);
                                  }}
                                  title={variant.title}
                                  className={[
                                    'h-4 w-4 rounded-full border',
                                    active ? 'border-zinc-900 ring-1 ring-zinc-900' : 'border-zinc-300',
                                  ].join(' ')}
                                  style={
                                    swatchUrl
                                      ? {
                                        backgroundImage: `url(${swatchUrl})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                      }
                                      : undefined
                                  }
                                />
                              );
                            })}
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="col-span-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-6 text-sm text-zinc-600">
                    Không có product phù hợp với bộ lọc hiện tại.
                  </div>
                )}
              </div>

            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

