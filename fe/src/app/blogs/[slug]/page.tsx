import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { getBlogPostBySlug, getBlogPosts, type BlogPost } from '@/api/blog.api';
import { Container } from '@/components/Container';
import { formatDateVn } from '@/lib/blog/format';
import { markdownToHtml } from '@/lib/blog/markdown';
import type { BlogPostPageProps, TocItem } from '@/types/blog';

const ARTICLE_PROSE_CLASS =
  'mt-10 max-w-none [&_a]:text-emerald-700 [&_a]:underline-offset-2 hover:[&_a]:underline [&_blockquote]:my-8 [&_blockquote]:rounded-2xl [&_blockquote]:border-l-4 [&_blockquote]:border-emerald-500 [&_blockquote]:bg-emerald-50/40 [&_blockquote]:px-5 [&_blockquote]:py-4 [&_blockquote]:text-zinc-700 [&_figure]:my-8 [&_h1]:mt-12 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h1]:text-zinc-900 [&_h2]:mt-12 [&_h2]:text-[1.75rem] [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-zinc-900 [&_h3]:mt-8 [&_h3]:text-[1.35rem] [&_h3]:font-semibold [&_h3]:tracking-tight [&_h3]:text-zinc-900 [&_img]:rounded-2xl [&_ol]:mt-5 [&_ol]:space-y-3 [&_ol]:pl-6 [&_ol]:text-zinc-700 [&_p]:mt-6 [&_p]:text-[16px] [&_p]:leading-8 [&_p]:text-zinc-700 [&_strong]:font-semibold [&_strong]:text-zinc-950 [&_ul]:mt-5 [&_ul]:space-y-3 [&_ul]:pl-6 [&_ul]:text-zinc-700';

function estimateReadingMinutes(content: string): number {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 180));
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

const getPostOrNull = async (slug: string): Promise<BlogPost | null> => {
  try {
    return await getBlogPostBySlug(slug);
  } catch {
    return null;
  }
};

function extractToc(markdown: string): TocItem[] {
  const idCount = new Map<string, number>();

  return markdown
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .flatMap((line): TocItem[] => {
      const match = line.match(/^(#{1,3})\s+(.*)$/);
      if (!match) return [];

      const level = match[1].length as 1 | 2 | 3;
      const label = match[2].trim();
      if (!label) return [];

      const baseId = slugifyHeading(label);
      const seen = idCount.get(baseId) ?? 0;
      idCount.set(baseId, seen + 1);
      const id = seen === 0 ? baseId : `${baseId}-${seen + 1}`;

      return [{ id, label, level }];
    });
}

function injectHeadingIds(html: string, tocItems: TocItem[]): string {
  let idx = 0;
  return html.replace(
    /<h([1-3]) class="([^"]*)">([\s\S]*?)<\/h\1>/g,
    (_m, level, className, content) => {
      const id = tocItems[idx]?.id ?? `section-${idx + 1}`;
      idx += 1;
      return `<h${level} id="${id}" class="${className} scroll-mt-28">${content}</h${level}>`;
    },
  );
}

function getTocItemClass(level: TocItem['level']): string {
  if (level === 1) return 'font-medium text-zinc-800';
  if (level === 2) return 'pl-3';
  return 'pl-6 text-[13px]';
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const post = await getBlogPostBySlug(slug);
    return {
      title: `${post.title} | Floring`,
      description: post.excerpt ?? post.title,
    };
  } catch {
    return {
      title: 'Blog | Floring',
      description: 'Bài viết không tồn tại hoặc hệ thống chưa sẵn sàng.',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostOrNull(slug);

  if (!post) {
    return (
      <main className="min-h-screen bg-white text-zinc-950">
        <section className="border-b border-zinc-200 bg-zinc-50 py-10">
          <Container>
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                Bài viết không tồn tại
              </h1>
              <p className="mt-4 text-sm leading-7 text-zinc-600">
                Không tìm thấy bài viết với slug{' '}
                <span className="font-mono text-zinc-900">{slug}</span>.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-12">
          <Container>
            <div className="rounded-3xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600 shadow-sm">
              <div>Bạn có thể quay lại danh sách blog hoặc xem thêm dự án.</div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/blogs"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  Về danh sách blog
                </Link>
                <Link
                  href="/projects"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 font-semibold text-white transition hover:bg-emerald-700"
                >
                  Xem dự án
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  const readingMinutes = estimateReadingMinutes(post.content);
  const tocItems = extractToc(post.content);
  const articleHtml = injectHeadingIds(markdownToHtml(post.content), tocItems);
  const relatedRes = await getBlogPosts(1, 10).catch(() => null);
  const relatedPosts = (relatedRes?.data ?? [])
    .filter((item) => item.slug !== post.slug)
    .slice(0, 8);

  return (
    <main className="min-h-screen bg-white text-zinc-950">
      <section className="py-6 sm:py-8">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_380px] xl:gap-8">
            <aside className="hidden lg:block">
              <div className="sticky top-6 max-h-[calc(100vh-2rem)] overflow-y-auto rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  Mục lục
                </div>
                <div className="space-y-2">
                  {tocItems.length ? (
                    tocItems.map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`block truncate rounded-lg px-2 py-1.5 text-sm leading-6 text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950 ${getTocItemClass(item.level)}`}
                      >
                        {item.label}
                      </a>
                    ))
                  ) : (
                    <p className="text-sm leading-6 text-zinc-500">
                      Chưa có mục lục .
                    </p>
                  )}
                </div>
              </div>
            </aside>

            <article className="min-w-0">
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 text-sm text-zinc-700 transition hover:text-zinc-950"
              >
                <span aria-hidden="true" className="text-base leading-none">
                  ←
                </span>
                <span>Tất cả bài viết</span>
              </Link>

              <header className="mt-5">
                <div className="mb-4 inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-100">
                  Blog Floring
                </div>
                <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-[3.15rem]">
                  {post.title}
                </h1>

                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
                  <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1.5 font-medium text-zinc-800">
                    Floring
                  </span>
                  <span>{formatDateVn(post.createdAt)}</span>
                  <span aria-hidden="true" className="text-zinc-300">•</span>
                  <span>{readingMinutes} phút đọc</span>
                </div>
              </header>

              <div className="mt-10 pb-10 lg:pb-16">
                {post.excerpt ? (
                  <p className="max-w-4xl border-l-2 border-emerald-300 pl-4 text-lg leading-relaxed text-zinc-700 sm:text-xl">
                    {post.excerpt}
                  </p>
                ) : null}

                {post.imageUrl ? (
                  <figure className="mt-8 overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm">
                    <div className="relative aspect-[16/9]">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        priority
                        className="object-cover"
                        sizes="(max-width: 1280px) 100vw, 780px"
                        unoptimized
                      />
                    </div>
                  </figure>
                ) : null}

                <div className="mt-8 sm:px-1">
                  <div
                    className={ARTICLE_PROSE_CLASS}
                    dangerouslySetInnerHTML={{ __html: articleHtml }}
                  />
                </div>
              </div>
            </article>

            <aside className="hidden xl:block">
              <div className="sticky top-6">
                <h2 className="text-2xl font-semibold leading-none text-zinc-950">Bài viết liên quan</h2>
                <div className="mt-6 max-h-[76vh] space-y-3 overflow-y-auto pr-2">
                  {relatedPosts.length ? (
                    relatedPosts.map((item) => (
                      <article key={item.id} className="group rounded-2xl border border-zinc-200/70 bg-white p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-sm">
                        <Link href={`/blogs/${item.slug}`} className="flex items-start gap-3">
                          <div className="relative h-[70px] w-[112px] shrink-0 overflow-hidden rounded-md bg-zinc-100">
                            {item.imageUrl ? (
                              <Image
                                src={item.imageUrl}
                                alt={item.title}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                                sizes="75px"
                                unoptimized
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-50" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-base font-semibold leading-6 text-zinc-900 transition group-hover:text-emerald-700">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-xs text-zinc-500">
                              {formatDateVn(item.createdAt)}
                            </p>
                          </div>
                        </Link>
                      </article>
                    ))
                  ) : (
                    <p className="text-sm text-zinc-500">Chưa có bài viết liên quan.</p>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </main>
  );
}
