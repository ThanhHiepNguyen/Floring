import type { Metadata } from 'next';

import { backendGet } from '@/lib/backend';
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
};

type ProductSlugPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProductSlugPageProps): Promise<Metadata> {
  const p = await params;
  const res = await backendGet<ProductApiResponse>(`/product/by-slug/${p.slug}`).catch(() => null);
  const product = res?.data?.products?.[0];

  if (!product) {
    return {
      title: 'Sản phẩm không tìm thấy | Floring',
      description: 'Sản phẩm bạn tìm không tồn tại. Vui lòng quay lại trang khác.',
    };
  }

  return {
    title: `${product.title} | Floring`,
    description: product.description ?? '',
  };
}

export default async function ProductDetailPage({ params }: ProductSlugPageProps) {
  const p = await params;
  const res = await backendGet<ProductApiResponse>(`/product/by-slug/${p.slug}`).catch(() => null);
  const product = res?.data?.products?.[0];

  if (!product) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-5xl px-4 py-20">
          <h1 className="text-3xl font-semibold text-zinc-900">Sản phẩm không tìm thấy</h1>
          <p className="mt-3 text-zinc-600">Sản phẩm bạn tìm không tồn tại.</p>
        </div>
      </main>
    );
  }

  let relatedProducts: Product[] = [];
  if (product?.serviceId) {
    // Fetch all products for this service so the carousel can be "đủ hàng" without pagination.
    const limitPerPage = 50;
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const relatedRes = await backendGet<ProductApiResponse>('/product', {
        searchParams: { serviceId: product.serviceId, page, limit: limitPerPage },
      }).catch(() => null);

      const batch = relatedRes?.data?.products ?? [];
      relatedProducts.push(...batch.filter((x) => x.id !== product.id));

      // If BE didn't return meta, fallback to stop when batch is smaller than limit.
      const meta = (relatedRes as any)?.meta;
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
  }

  return <ProductDetailClient product={product} relatedProducts={relatedProducts} />;
}

