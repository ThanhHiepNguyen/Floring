import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/Container';

import type { FeaturedItem } from '@/types/listing';

type FeaturedListingProps = {
    heading: string;
    featured?: FeaturedItem | null;
    curated: FeaturedItem[];
    recent: FeaturedItem[];
    basePath: string; // e.g. '/blogs' or '/projects'
    recentHeading?: string;
    curatedHeading?: string;
    allLinkLabel?: string;
};

function Thumb({ title, imageUrl, sizes }: { title: string; imageUrl?: string | null; sizes: string }) {
    if (!imageUrl) {
        return <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-50" />;
    }
    return (
        <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
            sizes={sizes}
            unoptimized
        />
    );
}

export function FeaturedListing({
    heading,
    featured,
    curated,
    recent,
    basePath,
    recentHeading = 'Recent',
    curatedHeading = 'Other featured',
    allLinkLabel = 'All',
}: FeaturedListingProps) {
    return (
        <main className="min-h-screen bg-white text-zinc-950">
            <section className="py-6 sm:py-8">
                <Container>
                    <h1 className="sr-only">{heading}</h1>
                    {(!featured && recent.length === 0) ? (
                        <div className="rounded-3xl border border-zinc-200 bg-white p-10 text-sm text-zinc-600 shadow-sm">
                            Không có nội dung.
                        </div>
                    ) : (
                        <>
                            <section>
                                <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_420px] lg:gap-5">
                                    <div>
                                        {featured ? (
                                            <article className="group h-full">
                                                <Link href={`${basePath}/${featured.slug}`} className="block h-full">
                                                    <div className="relative overflow-hidden rounded-2xl">
                                                        <div className="relative aspect-[16/9]">
                                                            <Thumb title={featured.title} imageUrl={featured.imageUrl} sizes="(max-width: 1024px) 100vw, 70vw" />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                                                            <div className="absolute inset-x-0 bottom-0 px-5 py-4 sm:px-6 sm:py-5">
                                                                <h2 className="line-clamp-2 text-2xl font-semibold leading-tight text-white sm:text-[2.2rem]">
                                                                    {featured.title}
                                                                </h2>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            </article>
                                        ) : null}
                                    </div>

                                    <aside>
                                        <h2 className="text-2xl font-semibold leading-none">{curatedHeading}</h2>
                                        <div className="mt-2 space-y-1">
                                            {curated.map((item) => (
                                                <Link key={item.id} href={`${basePath}/${item.slug}`} className="block">
                                                    <article className="group flex items-start gap-3 rounded-lg p-1 transition hover:bg-zinc-50">
                                                        <div className="relative h-[68px] w-[96px] shrink-0 overflow-hidden rounded-md bg-zinc-100">
                                                            <Thumb title={item.title} imageUrl={item.imageUrl} sizes="96px" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <h3 className="line-clamp-2 text-[15px] font-semibold leading-5 text-zinc-950">
                                                                {item.title}
                                                            </h3>
                                                            {item.excerpt ? (
                                                                <p className="mt-0.5 line-clamp-1 text-[12px] leading-4 text-zinc-500">{item.excerpt}</p>
                                                            ) : null}
                                                        </div>
                                                    </article>
                                                </Link>
                                            ))}
                                        </div>
                                    </aside>
                                </div>
                            </section>

                            <section className="mt-6 sm:mt-8">
                                <div className="mb-3 flex items-center justify-between gap-4">
                                    <h2 className="text-3xl font-semibold leading-none">{recentHeading}</h2>
                                    <Link
                                        href={basePath}
                                        className="inline-flex h-7 items-center rounded-full border border-zinc-300 px-3 text-[11px] font-medium text-zinc-900 transition hover:bg-zinc-50"
                                    >
                                        {allLinkLabel}
                                    </Link>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                    {recent.map((item) => (
                                        <article key={item.id} className="space-y-2">
                                            <Link href={`${basePath}/${item.slug}`} className="group block aspect-[4/3]">
                                                <div className="relative size-full overflow-hidden rounded-2xl bg-zinc-100">
                                                    <Thumb title={item.title} imageUrl={item.imageUrl} sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" />
                                                </div>
                                            </Link>
                                            <div>
                                                <Link
                                                    href={`${basePath}/${item.slug}`}
                                                    className="line-clamp-2 text-2xl font-semibold leading-tight text-zinc-950 transition hover:text-emerald-700"
                                                >
                                                    {item.title}
                                                </Link>
                                                {item.excerpt ? (
                                                    <p className="mt-1 line-clamp-2 text-sm leading-5 text-zinc-600">{item.excerpt}</p>
                                                ) : null}
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </section>
                        </>
                    )}
                </Container>
            </section>
        </main>
    );
}

