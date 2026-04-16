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
    <main className="min-h-screen bg-white text-zinc-900">
      <section className="border-b border-zinc-200/70 bg-white py-6">
        <Container>
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Services' },
              { label: service.name },
            ]}
          />
        </Container>
      </section>

      <section className="relative">
        <div className="relative h-[320px] w-full overflow-hidden bg-zinc-100 sm:h-[420px] lg:h-[520px]">
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.10)_0%,rgba(255,255,255,0.30)_35%,rgba(255,255,255,0.70)_100%)]" />
          <div className="absolute inset-0 z-10 flex items-center justify-center p-6 text-center">
            <div className="max-w-4xl">
              <div className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Service
              </div>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-6xl">
                {service.name}
              </h1>
              <p className="mx-auto mt-4 max-w-3xl text-base leading-7 text-zinc-600 sm:text-xl">
                {service.description}
              </p>

            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-slate-50 py-10">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12">
            <aside className="lg:col-span-4">
              <div className="sticky top-24 space-y-4">
                <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Selected overview</p>
                  <p className="mt-2 text-lg font-semibold text-zinc-900">{service.name}</p>
                  {selectedState?.variant?.title ? (
                    <p className="mt-1 text-sm text-zinc-600">{selectedState.variant.title}</p>
                  ) : null}

                  {heroImage ? (
                    <div className="mt-4 overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100">
                      <div className="relative aspect-[16/10]">
                        <Image
                          src={normalizeImageUrl(heroImage)}
                          alt={selectedState?.variant.title || service.name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-5">
                    <ServiceContactRequestForm
                      mode="dialog"
                      serviceId={service.id}
                      serviceName={service.name}
                      productVariantId={selectedVariantId}
                      triggerLabel="Get consultation"
                      triggerVariant="form"
                      triggerClassName="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    />
                  </div>
                </div>

                <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Quick filters</p>
                  <div className="mt-3 space-y-3">
                    <div className="relative">
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
                        className="w-full rounded-2xl border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/60"
                      />
                    </div>

                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'name-asc' | 'name-desc')}
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100/60"
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
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-50"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <div className="lg:col-span-8">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Product list</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">
                    Pick your style & color
                  </h2>
                </div>
                <p className="text-sm text-zinc-600">{filteredProducts.length} products</p>
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
                    const isTogglingThis = permalink ? togglingPermalink === permalink : false;

                    return (
                      <article
                        key={item.id}
                        className={[
                          'group overflow-hidden rounded-2xl border bg-white p-3 shadow-sm transition',
                          selectedInCard?.id === selectedVariantId
                            ? 'border-emerald-400 bg-emerald-50/50'
                            : 'border-zinc-200 hover:bg-zinc-50',
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
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-zinc-100">
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
                                aria-label={isFav ? 'Remove favorite' : 'Add to favorites'}
                                title={isFav ? 'Remove favorite' : 'Add to favorites'}
                                disabled={isTogglingThis}
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
                                  'absolute right-2 top-2 z-20 inline-flex size-9 items-center justify-center rounded-full border bg-white/90 shadow-sm backdrop-blur transition-all duration-300 ease-out',
                                  'transform-gpu active:scale-90 disabled:cursor-not-allowed',
                                  'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 hover:bg-white',
                                  isTogglingThis ? 'scale-95 opacity-100' : 'hover:scale-105',
                                  isFav
                                    ? 'border-rose-200 text-rose-600 bg-rose-50/80'
                                    : 'border-zinc-200 text-zinc-700',
                                ].join(' ')}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill={isFav ? 'currentColor' : 'none'}
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className={[
                                    'size-5 transition-transform duration-300 ease-out',
                                    isTogglingThis ? 'scale-110 animate-pulse' : 'scale-100',
                                  ].join(' ')}
                                  aria-hidden="true"
                                >
                                  <path d="M19.5 12.1L12 19.6l-7.5-7.5a5.2 5.2 0 0 1 0-7.4 5.2 5.2 0 0 1 7.4 0L12 4.8l.1-.1a5.2 5.2 0 0 1 7.4 0 5.2 5.2 0 0 1 0 7.4Z" />
                                </svg>
                              </button>
                            ) : null}

                            <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:opacity-100 group-hover:bg-black/20">
                              <div onClick={(e) => e.stopPropagation()} className="opacity-100">
                                <ServiceContactRequestForm
                                  serviceId={service.id}
                                  serviceName={service.name}
                                  productVariantId={selectedInCard?.id ?? selectedVariantId}
                                  mode="dialog"
                                  triggerLabel="Contact"
                                  triggerClassName="rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-zinc-900 shadow-sm hover:bg-white"
                                  triggerVariant="form"
                                />
                              </div>
                            </div>
                          </div>

                          <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-zinc-900">
                            {item.title}
                          </h3>
                          <p className="mt-1 text-xs text-zinc-500">Other colours in this range</p>
                          <div className="mt-3 flex flex-wrap items-center gap-2">
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
                  <div className="col-span-full rounded-2xl border border-zinc-200 bg-white px-4 py-6 text-sm text-zinc-600 shadow-sm">
                    No products match the current filters.
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

