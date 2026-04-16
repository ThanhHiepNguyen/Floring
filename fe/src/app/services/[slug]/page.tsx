import type { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/Container';
import { backendGet } from '@/lib/backend';
import { ServiceDetailClient } from '@/components/service/ServiceDetailClient';
import type { Service, ServicePageProps } from '@/types/services';

type ApiVariant = {
  id: string;
  title: string;
  image?: string | null;
  primaryImage?: string | null;
  swatchImage?: string | null;
  colour?: string | null;
  price?: number | null;
};

type ApiProduct = {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  brand?: string | null;
  style?: string | null;
  priceRange?: { minPrice?: number | null; maxPrice?: number | null } | null;
  currentVariant?: ApiVariant | null;
  variants: ApiVariant[];
};

type ProductApiResponse = {
  data: {
    products: ApiProduct[];
  };
};

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const p = await params;
  const service = await backendGet<Service>(`/service/${p.slug}`).catch(() => null);

  if (!service) {
    return {
      title: 'Service not found | Floring',
      description: 'The service you are looking for does not exist. Please go back to another page.',
    };
  }

  const baseOgImage = service.imageUrl || '/slides/slide-1.svg';

  return {
    title: `${service.name} | Floring`,
    description: service.description ?? '',
    openGraph: {
      title: `${service.name} | Floring`,
      description: service.description ?? '',
      images: [baseOgImage],
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const p = await params;
  const service = await backendGet<Service>(`/service/${p.slug}`).catch(() => null);

  if (!service) {
    return (
      <main className="min-h-screen bg-background text-foreground">
        <Container className="py-20">
          <h1 className="text-3xl font-semibold text-zinc-900">Service not found</h1>
          <p className="mt-4 text-zinc-600">The service you are looking for does not exist.</p>

          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
          >
            Back to homepage
          </Link>
        </Container>
      </main>
    );
  }

  const productRes = await backendGet<ProductApiResponse>(
    '/product',
    { searchParams: { serviceId: service.id, page: 1, limit: 50 } },
  ).catch(() => null);

  const products = Array.isArray(productRes?.data?.products) ? productRes.data.products : [];

  return <ServiceDetailClient service={service} products={products} />;
}

