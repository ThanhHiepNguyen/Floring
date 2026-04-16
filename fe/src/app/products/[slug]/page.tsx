import type { Metadata } from 'next';

import { api } from '@/api/http';
import { toApiErrorMessage } from '@/api/http';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';

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

type ProductApiResponse = {
  data: {
    products: Product[];
  };
  meta?: {
    hasMoreItems?: boolean;
  };
};

type ProductSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductSlugPageProps): Promise<Metadata> {
  const p = await params;
  const res = await api.get<ProductApiResponse>(`/product/by-slug/${p.slug}`).then((r) => r.data).catch(() => null);
  const product = res?.data?.products?.[0];

  if (!product) {
    return {
      title: 'Product not found | Floring',
      description: 'The product you are looking for does not exist. Please return to another page.',
    };
  }

  return {
    title: `${product.title} | Floring`,
    description: product.description ?? '',
  };
}

export default async function ProductDetailPage({ params }: ProductSlugPageProps) {
  const p = await params;
  const res = await api.get<ProductApiResponse>(`/product/by-slug/${p.slug}`).then((r) => r.data).catch(() => null);
  const product = res?.data?.products?.[0];

  if (!product) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h1 className="text-3xl font-semibold text-zinc-900">Product not found</h1>
          <p className="mt-3 text-zinc-600">The product you are looking for does not exist.</p>
        </div>
      </main>
    );
  }

  let relatedProducts: Product[] = [];
  // Fetch all products (not only same service) for the horizontal rail.
  const limitPerPage = 50;
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const relatedRes = await api
      .get<ProductApiResponse>('/product', { params: { page, limit: limitPerPage } })
      .then((r) => r.data)
      .catch(() => null);

    const batch = relatedRes?.data?.products ?? [];
    relatedProducts.push(...batch.filter((x) => x.id !== product.id));

    // If BE didn't return meta, fallback to stop when batch is smaller than limit.
    const meta = relatedRes?.meta;
    if (meta?.hasMoreItems === false) {
      hasMore = false;
    } else if (batch.length < limitPerPage) {
      hasMore = false;
    } else {
      page += 1;
    }
  }

  // Remove potential duplicates from multi-page fetch.
  relatedProducts = Array.from(new Map(relatedProducts.map((p) => [p.id, p])).values());

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}

