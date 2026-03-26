import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Container } from '@/components/Container';
import { backendGet } from '@/lib/backend';
import { normalizeImageUrl } from '@/lib/asset';
import { ServiceContactRequestForm } from '@/components/service/ServiceContactRequestForm';
import type { Project, ProjectPageProps, ProjectsResponse } from '@/types/projects';

async function getProjectBySlug(slug: string) {
  return backendGet<Project>(`/project/public/slug/${slug}`);
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) {
    return {
      title: 'Dự án không tìm thấy | Floring',
      description: 'Dự án không tồn tại hoặc hệ thống chưa sẵn sàng.',
    };
  }

  return {
    title: `${project.title} | Floring`,
    description: project.description ?? '',
    openGraph: {
      title: `${project.title} | Floring`,
      description: project.description ?? '',
      images: [project.images?.[0]?.imageUrl || '/slides/slide-1.svg'],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug).catch(() => null);

  if (!project) {
    return (
      <main className="min-h-screen bg-[#f6f3ee] text-zinc-950">
        <section className="border-b border-black/5 bg-[linear-gradient(180deg,#f4efe8_0%,#f8f6f2_48%,#ffffff_100%)] py-10">
          <Container>
            <Breadcrumbs
              items={[
                { label: 'Trang chu', href: '/' },
                { label: 'Dự án', href: '/projects' },
                { label: slug },
              ]}
            />

            <div className="mt-8 max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Không tìm thấy
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-950">
                Dự án không tồn tại
              </h1>
              <p className="mt-4 text-sm leading-7 text-zinc-600">
                Không tìm thấy dự án với slug <span className="font-mono text-zinc-900">{slug}</span>.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-12">
          <Container>
            <div className="rounded-[30px] border border-black/5 bg-white/80 p-8 shadow-[0_20px_50px_rgba(24,24,27,0.08)] backdrop-blur">
              <div className="text-sm text-zinc-600">
                Bạn có thể quay lại danh sách dự án hoặc xem thêm sản phẩm.
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/projects"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                >
                  Về danh sách dự án
                </Link>
                <Link
                  href="/search"
                  className="inline-flex h-11 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  Xem sản phẩm
                </Link>
              </div>
            </div>
          </Container>
        </section>
      </main>
    );
  }

  const cover = project.images?.[0]?.imageUrl;

  const relatedRes = await backendGet<ProjectsResponse>('/project', {
    searchParams: { page: 1, limit: 6 },
  }).catch(() => null);
  const relatedProjects = (relatedRes?.data ?? [])
    .filter((item) => item.slug !== project.slug)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Project',
    name: project.title,
    description: project.description,
    url: `https://yourdomain.com/projects/${project.slug}`,
    location: project.location,
    image: project.images?.map((i) => i.imageUrl).filter(Boolean),
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f6f3ee] text-zinc-950">
      <section className="relative overflow-hidden border-b border-black/5 bg-[linear-gradient(180deg,#f4efe8_0%,#f7f5f1_46%,#fbfbfa_100%)] py-8 sm:py-10">
        <div className="absolute left-[-5rem] top-8 h-40 w-40 rounded-full bg-amber-200/35 blur-3xl" />
        <div className="absolute right-[-3rem] top-12 h-48 w-48 rounded-full bg-emerald-200/30 blur-3xl" />

        <Container>
          <Breadcrumbs
            items={[
              { label: 'Trang chủ', href: '/' },
              { label: 'Dự án', href: '/projects' },
              { label: project.title },
            ]}
          />

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <div className="max-w-6xl lg:col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Dự án thi công
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-none tracking-[-0.045em] text-zinc-950 sm:text-5xl lg:text-5xl text-balance lg:whitespace-nowrap">
                {project.title}
              </h1>
              {project.description ? (
                <p className="mt-5 text-base leading-8 text-zinc-600">
                  {project.description}
                </p>
              ) : null}

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="rounded-full border border-black/5 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm backdrop-blur">
                  {project.location || 'Đang cập nhật'}
                </div>
                <div className="rounded-full border border-black/5 bg-white/70 px-4 py-2 text-sm font-semibold text-zinc-950 shadow-sm backdrop-blur">
                  {typeof project.totalAreaM2 === 'number' ? `${project.totalAreaM2} m2` : 'Diện tích đang cập nhật'}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
            <div className="space-y-6">
              <div className="rounded-[34px] border border-black/5 bg-white/80 p-4 shadow-[0_20px_50px_rgba(24,24,27,0.06)] backdrop-blur sm:p-6">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                      Hình ảnh dự án
                    </p>
                    <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
                      Bộ sưu tập thi công
                    </h2>
                  </div>
                </div>

                <div className="relative overflow-hidden rounded-[28px] border border-black/5 bg-zinc-950">
                  {cover ? (
                    <div className="relative aspect-[16/7] sm:aspect-[16/8]">
                      <Image
                        src={normalizeImageUrl(cover)}
                        alt={project.title}
                        fill
                        priority
                        className="object-cover"
                        sizes="100vw"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    </div>
                  ) : (
                    <div className="relative aspect-[16/7] sm:aspect-[16/8] bg-zinc-950" />
                  )}
                </div>

              </div>

              <div className="rounded-[32px] border border-black/5 bg-white/80 p-6 shadow-[0_20px_50px_rgba(24,24,27,0.07)] backdrop-blur sm:p-8 lg:p-10">
                <div className="grid gap-6">
                  <div className="rounded-[24px] bg-zinc-50 p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-zinc-500">
                      Tổng quan
                    </p>
                    <h2 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
                      Hoàn thiện theo yêu cầu thực tế
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-zinc-600">
                      {project.description ||
                        'Dự án được trình bày theo hướng gọn gàng, tập trung vào hình ảnh thi công thực tế.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-[30px] border border-black/5 bg-white/82 p-6 shadow-[0_20px_50px_rgba(24,24,27,0.07)] backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                  Tiếp theo
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-zinc-950">
                  Muốn làm dự án tương tự?
                </h3>
                <p className="mt-3 text-sm leading-7 text-zinc-600">
                  Gửi yêu cầu để nhận tư vấn vật liệu, cách xử lý mặt bằng và phong cách hoàn thiện phù hợp
                  với không gian của bạn.
                </p>

                <div className="mt-5">
                  <ServiceContactRequestForm
                    mode="dialog"
                    serviceId={null}
                    serviceName={null}
                    productVariantId={null}
                    triggerLabel="Liên hệ tư vấn"
                    triggerVariant="form"
                    triggerClassName="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href="/search"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Xem sản phẩm
                  </Link>
                  <Link
                    href="/projects"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Tất cả dự án
                  </Link>
                </div>
              </div>

              <div className="rounded-[30px] border border-black/5 bg-white/82 p-6 shadow-[0_20px_50px_rgba(24,24,27,0.07)] backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                    Dự án liên quan
                  </p>
                  <Link
                    href="/projects"
                    className="text-sm font-medium text-emerald-700 transition hover:text-emerald-800"
                  >
                    Xem tất cả
                  </Link>
                </div>

                <div className="mt-5 space-y-4">
                  {relatedProjects.length ? (
                    relatedProjects.map((item) => (
                      <article key={item.id} className="group">
                        <Link
                          href={`/projects/${item.slug}`}
                          className="flex items-start gap-4 rounded-[22px] border border-zinc-200 bg-white/60 p-3 transition hover:bg-white"
                        >
                          <div className="relative h-[85px] w-[85px] shrink-0 overflow-hidden rounded-[18px] bg-zinc-100 border border-zinc-200">
                            {item.images?.[0]?.imageUrl ? (
                              <Image
                                src={normalizeImageUrl(item.images[0].imageUrl)}
                                alt={item.title}
                                fill
                                className="object-cover transition duration-500 group-hover:scale-[1.04]"
                                sizes="72px"
                                unoptimized
                              />
                            ) : (
                              <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-50" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-[15px] font-semibold leading-6 text-zinc-900 transition group-hover:text-emerald-700">
                              {item.title}
                            </h3>
                            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-zinc-400 line-clamp-1">
                              {item.location || '—'}
                            </p>
                          </div>
                        </Link>
                      </article>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-zinc-50 p-4 text-sm text-zinc-600">
                      Chưa có dự án liên quan.
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </main>
  );
}
