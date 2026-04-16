import { Container } from '@/components/Container';
import Link from 'next/link';
import Image from 'next/image';
import { backendGet } from '@/lib/backend';
import { normalizeImageUrl } from '@/lib/asset';
import type { SearchPageProps, SearchResponse } from '@/types/search';

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const q = params.q;
    const query = Array.isArray(q) ? q[0] : q ?? '';
    const pageParam = Array.isArray(params.page) ? params.page[0] : params.page;
    const page = Math.max(1, Number(pageParam) || 1);
    const limit = 12;

    const trimmed = query.trim();

    const res = await backendGet<SearchResponse>('/service', {
        searchParams: { page, limit },
    }).catch(() => null);

    const items = res?.data ?? [];
    const filtered = trimmed
        ? items.filter((s) => s.name.toLowerCase().includes(trimmed.toLowerCase()))
        : items;

    return (
        <main className="min-h-[70vh] bg-background text-foreground">
            <Container className="py-10">
                <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    Keyword: <span className="font-medium text-foreground">{query}</span>
                </p>

                {filtered.length ? (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((p) => (
                            <article
                                key={p.id}
                                className="overflow-hidden rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
                            >
                                <Link href={`/services/${p.slug}`}>
                                    <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-900">
                                        {p.imageUrl ? (
                                            <Image
                                                src={normalizeImageUrl(p.imageUrl)}
                                                alt={p.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : null}
                                    </div>
                                    <div className="p-5">
                                        <h2 className="mt-1 text-base font-semibold text-zinc-900 dark:text-zinc-100">
                                            {p.name}
                                        </h2>
                                        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                                            {p.description || 'View product details.'}
                                        </p>
                                    </div>
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                        {trimmed ? 'No matching services found.' : 'No services available yet.'}
                    </div>
                )}
            </Container>
        </main>
    );
}

