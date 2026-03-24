import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { LuxurySlideshow } from '@/components/home/LuxurySlideshow';
import { Container } from '@/components/Container';
import { backendGet } from '@/lib/backend';
import { getBlogPosts } from '@/api/blog.api';
import { ContactRequestForm } from '@/components/contact/ContactRequestForm';
import { RevealOnScroll } from '@/components/animation/RevealOnScroll';
import type {
  FAQItem,
  HomeProjectsResponse,
  HomeServiceListResponse,
  ProcessStep,
  QualityItem,
  Testimonial,
} from '@/types/home';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Tiếp nhận nhu cầu',
    desc: 'Bạn gửi yêu cầu và lựa chọn dịch vụ/mẫu màu. Floring xác nhận thông tin để lên kế hoạch khảo sát.',
  },
  {
    step: '02',
    title: 'Khảo sát & tư vấn giải pháp',
    desc: 'Đội ngũ kỹ thuật xem hiện trạng, đề xuất phương án thi công phù hợp với điều kiện sàn và không gian.',
  },
  {
    step: '03',
    title: 'Lên phương án & báo giá',
    desc: 'Chốt scope, vật liệu và timeline. Bạn nắm rõ tiến độ, chi phí và các hạng mục phát sinh (nếu có).',
  },
  {
    step: '04',
    title: 'Thi công theo tiêu chuẩn',
    desc: 'Thi công đúng kỹ thuật, kiểm soát chất lượng trong từng giai đoạn để đảm bảo độ bền và độ hoàn thiện.',
  },
  {
    step: '05',
    title: 'Bàn giao & bảo hành',
    desc: 'Hướng dẫn vệ sinh/bảo dưỡng đúng cách. Hỗ trợ sau thi công để sàn luôn bền đẹp theo thời gian.',
  },
  {
    step: '06',
    title: 'Tư vấn sau khi sử dụng',
    desc: 'Nếu có câu hỏi hoặc cần bảo trì, Floring hỗ trợ để sàn duy trì hiệu suất tốt nhất.',
  },
];

const QUALITY_ITEMS: QualityItem[] = [
  {
    title: 'Vật liệu phù hợp',
    desc: 'Tư vấn đúng chủng loại sàn cho khí hậu và nhu cầu sử dụng thực tế.',
  },
  {
    title: 'Thi công chuẩn',
    desc: 'Kiểm soát giai đoạn chuẩn bị mặt bằng, lắp đặt và hoàn thiện bề mặt.',
  },
  {
    title: 'Bảo dưỡng & hỗ trợ',
    desc: 'Hướng dẫn cách vệ sinh, xử lý tình huống thường gặp để sàn bền đẹp lâu dài.',
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'Floring thi công những loại sàn nào?',
    a: 'Floring cung cấp giải pháp thi công cho sàn gỗ, sàn nhựa LVT và SPC. Tuỳ hiện trạng công trình, đội ngũ sẽ tư vấn vật liệu phù hợp nhất.',
  },
  {
    q: 'Thời gian khảo sát và thi công mất bao lâu?',
    a: 'Thời gian cụ thể phụ thuộc phạm vi và tình trạng mặt bằng. Sau khi khảo sát, Floring sẽ lên timeline rõ ràng và cập nhật tiến độ trong suốt dự án.',
  },
  {
    q: 'Có bảo hành sau thi công không?',
    a: 'Có. Floring hỗ trợ sau bàn giao và hướng dẫn bảo dưỡng để sàn luôn bền đẹp. Tuỳ hạng mục, chính sách bảo hành sẽ được nêu rõ trong báo giá.',
  },
  {
    q: 'Tôi cần chuẩn bị gì trước khi đội thi công đến?',
    a: 'Bạn chỉ cần cung cấp thông tin nhu cầu và hiện trạng công trình. Đội ngũ sẽ hướng dẫn các bước chuẩn bị cần thiết để thi công diễn ra thuận lợi.',
  },
];

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'James Carter',
    role: 'House',
    quote:
      'Clear consultation, on-time installation, and the floor looks stunning. The surface is perfectly even and feels premium.',
  },
  {
    name: 'Sofia Nguyen',
    role: 'Apartment',
    quote:
      'They were professional from start to finish. The team cleaned up daily, and the final finish is exactly what we wanted.',
  },
  {
    name: 'Michael Thompson',
    role: 'Office',
    quote:
      'Fast response and detailed guidance. Installation was smooth, and the result matches the photos and samples.',
  },
  {
    name: 'Emily Johnson',
    role: 'Retail space',
    quote:
      'The project manager kept everything organized and transparent. We never had surprises, and the showroom looks upgraded.',
  },
  {
    name: 'Daniel Garcia',
    role: 'Apartment',
    quote:
      'Great workmanship and attention to detail. The seams are clean and the tone is consistent throughout.',
  },
  {
    name: 'Olivia Wilson',
    role: 'House',
    quote:
      'Professional crew, respectful of our home, and the floor installation was done with care. Highly recommended.',
  },
  {
    name: 'Ethan Brown',
    role: 'Office',
    quote:
      'From planning to completion, communication was excellent. The final floor quality is outstanding.',
  },
  {
    name: 'Amelia Martin',
    role: 'Showroom',
    quote:
      'Our brand image improved immediately. The finish looks uniform and the team worked efficiently with great control.',
  },
  {
    name: 'William Lee',
    role: 'Apartment',
    quote:
      'Smooth installation and very reliable service. We appreciated the step-by-step updates and guidance.',
  },
  {
    name: 'Grace Robinson',
    role: 'House',
    quote:
      'Beautiful result and excellent after-sales support. They answered every question patiently.',
  },
  {
    name: 'Henry Walker',
    role: 'Office',
    quote:
      'They delivered within schedule and the quality is consistently high. Our team is very satisfied.',
  },
  {
    name: 'Charlotte Perez',
    role: 'Retail space',
    quote:
      'The team handled everything professionally, including preparation and final finishing. The floor looks premium.',
  },
  {
    name: 'Alexander Young',
    role: 'House',
    quote:
      'Clear scope, clean workmanship, and a great finish. The floor feels durable and looks great daily.',
  },
  {
    name: 'Victoria King',
    role: 'Apartment',
    quote:
      'We chose the materials they recommended and it turned out perfect. Installation was neat and well controlled.',
  },
  {
    name: 'Joseph Wright',
    role: 'Showroom',
    quote:
      'The finishing quality is impressive. The team kept the area clean and managed the timeline properly.',
  },
  {
    name: 'Ella Scott',
    role: 'House',
    quote:
      'Strong communication and careful installation. We’re happy with both the look and the feel of the floor.',
  },
  {
    name: 'Thomas Hill',
    role: 'Office',
    quote:
      'Professional team with strong quality control. Everything from measurement to installation went smoothly.',
  },
  {
    name: 'Natalie Adams',
    role: 'Apartment',
    quote:
      'Very helpful consultation and honest recommendations. The final result is elegant and evenly matched.',
  },
  {
    name: 'Benjamin Baker',
    role: 'Retail space',
    quote:
      'The installation was fast without cutting corners. The floor looks aligned and the details are clean.',
  },
  {
    name: 'Chloe Turner',
    role: 'House',
    quote:
      'We loved the consistency across the entire space. After-sales support was also quick and friendly.',
  },
];

const CONTACT_HIGHLIGHTS = [
  'Trả lời trong 1 ngày làm việc',
  'Tư vấn rõ ràng về vật liệu & quy trình',
  'Hỗ trợ lên kế hoạch thi công',
] as const;

export const metadata: Metadata = {
  title: 'Floring | Sàn gỗ - LVT - SPC',
  description: 'Floring cung cấp dịch vụ thi công sàn gỗ chất lượng cao và giải pháp bảo dưỡng bền đẹp.',
};

export default async function Home() {
  const servicesRes = await backendGet<HomeServiceListResponse>('/service', {
    searchParams: { page: 1, limit: 6 },
  }).catch(() => null);
  const services = servicesRes?.data ?? [];

  const blogRes = await getBlogPosts(1, 3).catch(() => null);
  const blogPosts = blogRes?.data ?? [];

  const projectsRes = await backendGet<HomeProjectsResponse>('/project', {
    searchParams: { page: 1, limit: 3 },
  }).catch(() => null);
  const projects = projectsRes?.data ?? [];

  // Nếu chỉ có 1-2 dịch vụ thì dùng grid 2 cột để không bị “lép” do cấu hình luôn có cột thứ 3.
  const servicesGridCols =
    services.length <= 2 ? 'sm:grid-cols-2 lg:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3';

  return (
    <main className="min-h-screen bg-transparent text-foreground">
      <RevealOnScroll effect="fade">
        <LuxurySlideshow intervalMs={4200} variant="hero" />
      </RevealOnScroll>

      {/* Featured services */}
      <section className="bg-gradient-to-b from-transparent via-slate-50/60 to-transparent py-16">
        <RevealOnScroll effect="up">
          <Container>
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                Dịch vụ nổi bật
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Thi công theo phong cách bạn
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                Chọn một dịch vụ phù hợp, xem mẫu màu và gửi yêu cầu khảo sát để được tư vấn chi tiết.
              </p>
            </header>

            {services.length ? (
              <div className={`mt-12 mx-auto grid max-w-4xl gap-6 sm:gap-6 ${servicesGridCols}`}>
                {services.map((s) => (
                  <article
                    key={s.id}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <Link
                      href={`/services/${s.slug}`}
                      className="flex h-full flex-col"
                    >
                      <div className="relative aspect-[4/3] bg-emerald-50">
                        {s.imageUrl ? (
                          <Image
                            src={s.imageUrl}
                            alt={s.name}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 bg-emerald-100" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 transition group-hover:opacity-100" />
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-5">
                        <h3 className="text-base font-semibold tracking-tight text-zinc-900">
                          {s.name}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
                          {s.description || 'Xem chi tiết dịch vụ & mẫu màu.'}
                        </p>

                        <div className="mt-4">
                          <span className="inline-flex items-center text-sm font-semibold text-emerald-700">
                            Xem chi tiết <span className="ml-2">→</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-8 text-sm text-zinc-700">
                Hiện chưa có dịch vụ để hiển thị.
              </div>
            )}
          </Container>
        </RevealOnScroll>
      </section>

      {/* Featured blog posts */}
      <section className="bg-gradient-to-b from-transparent via-white to-transparent py-16">
        <RevealOnScroll effect="left" delayMs={120}>
          <Container>
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-rose-700">
                Blog & kiến thức
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Tin tức hữu ích cho người chọn sàn
              </h2>
            </header>

            {blogPosts.length ? (
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogPosts.map((p) => (
                  <article
                    key={p.id}
                    className="group overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <Link href={`/blogs/${p.slug}`}>
                      <div className="relative aspect-[16/10] bg-rose-50">
                        {p.imageUrl ? (
                          <Image
                            src={p.imageUrl}
                            alt={p.title}
                            fill
                            className="object-cover transition duration-500 group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                        ) : (
                          <div className="absolute inset-0 bg-rose-100" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-0 transition group-hover:opacity-100" />
                      </div>

                      <div className="p-5">
                        <h3 className="line-clamp-2 text-base font-semibold tracking-tight text-zinc-900">
                          {p.title}
                        </h3>
                        {p.excerpt ? (
                          <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-600">
                            {p.excerpt}
                          </p>
                        ) : null}
                        <div className="mt-4">
                          <span className="inline-flex items-center text-sm font-semibold text-rose-700">
                            Đọc bài <span className="ml-2">→</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : null}
          </Container>
        </RevealOnScroll>
      </section>

      {/* Featured projects */}
      <section className="bg-gradient-to-b from-transparent via-slate-50/70 to-transparent py-16">
        <RevealOnScroll effect="zoom" delayMs={60}>
          <Container>
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-indigo-700">
                Dự án tiêu biểu
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Những không gian đã được thi công thực tế
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                Xem hình ảnh minh hoạ và cảm nhận phong cách hoàn thiện mà Floring mang lại.
              </p>
            </header>

            {projects.length ? (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.slice(0, 3).map((p) => {
                  const cover = p.images?.[0]?.imageUrl;
                  return (
                    <article
                      key={p.id}
                      className="group overflow-hidden rounded-2xl border border-zinc-200/60 bg-white/80 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <Link href={`/projects/${p.slug}`}>
                        <div className="relative aspect-[4/3] bg-indigo-50">
                          {cover ? (
                            <Image
                              src={cover}
                              alt={p.title}
                              fill
                              className="object-cover transition duration-500 group-hover:scale-[1.03]"
                              sizes="(max-width: 768px) 100vw, 33vw"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 bg-indigo-100" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0 opacity-0 transition group-hover:opacity-100" />
                        </div>

                        <div className="p-5">
                          <h3 className="text-base font-semibold tracking-tight text-zinc-900">
                            {p.title}
                          </h3>
                          <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-600">
                            {p.description || 'Xem chi tiết dự án.'}
                          </p>
                          <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-indigo-700">
                            Xem dự án <span className="ml-1">→</span>
                          </div>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mt-12 rounded-xl border border-zinc-200 bg-white p-8 text-sm text-zinc-700">
                Chưa có dự án để hiển thị.
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
              >
                Xem toàn bộ dự án <span className="ml-2">→</span>
              </Link>
            </div>
          </Container>
        </RevealOnScroll>
      </section>

      {/* Process */}
      <section className="bg-gradient-to-b from-transparent via-emerald-50/40 to-transparent py-16">
        <RevealOnScroll effect="left" delayMs={120}>
          <Container>
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-700">
                Quy trình thi công
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Minh bạch từ khảo sát đến bàn giao
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                Mọi bước đều được lên kế hoạch rõ ràng để bạn yên tâm về tiến độ và chất lượng.
              </p>
            </header>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {PROCESS_STEPS.map((item) => (
                <article
                  key={item.step}
                  className="rounded-3xl border border-zinc-200/60 bg-white/80 p-8 shadow-sm backdrop-blur"
                >
                  <div className="text-sm font-semibold text-cyan-700">{item.step}</div>
                  <h3 className="mt-3 text-lg font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{item.desc}</p>
                </article>
              ))}
            </div>
          </Container>
        </RevealOnScroll>
      </section>

      {/* Quality guarantees */}
      <section className="bg-gradient-to-b from-transparent via-slate-50/60 to-transparent py-16">
        <RevealOnScroll effect="right" delayMs={120}>
          <Container>
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                Cam kết chất lượng
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Làm đúng kỹ thuật, bền theo thời gian
              </h2>
            </header>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {QUALITY_ITEMS.map((item) => (
                <article
                  key={item.title}
                  className="rounded-3xl border border-zinc-200/60 bg-white/80 p-8 shadow-sm backdrop-blur"
                >
                  <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{item.desc}</p>
                  <div className="mt-6 h-px w-12 bg-emerald-600" />
                </article>
              ))}
            </div>
          </Container>
        </RevealOnScroll>
      </section>

      {/* FAQ */}
      <section className="bg-gradient-to-b from-transparent via-emerald-50/30 to-transparent py-16">
        <RevealOnScroll effect="fade" delayMs={80}>
          <Container>
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-700">
                Câu hỏi thường gặp
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Bạn đang thắc mắc điều gì?
              </h2>
            </header>

            <div className="mx-auto mt-12 max-w-3xl space-y-4">
              {FAQ_ITEMS.map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-zinc-200/60 bg-white/80 px-6 py-4 shadow-sm backdrop-blur"
                >
                  <summary className="cursor-pointer list-none text-base font-semibold text-zinc-900">
                    {item.q}
                    <span className="ml-2 text-teal-700 group-open:rotate-180 transition-transform">
                      ↓
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-zinc-600">{item.a}</p>
                </details>
              ))}
            </div>
          </Container>
        </RevealOnScroll>
      </section>

      {/* Testimonials (static) */}
      <section className="bg-gradient-to-b from-transparent via-slate-50/60 to-transparent py-16">
        <RevealOnScroll effect="blur" delayMs={120}>
          <Container>
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
                Khách hàng chia sẻ
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Tin tưởng từ những trải nghiệm thực tế
              </h2>
            </header>

            <TestimonialsSection testimonials={TESTIMONIALS} initialCount={3} />
          </Container>
        </RevealOnScroll>
      </section>

      {/* Contact on home */}
      <section className="bg-gradient-to-r from-slate-100/70 via-emerald-50/50 to-slate-100/70 py-16">
        <RevealOnScroll effect="blur" delayMs={160}>
          <Container>
            <div className="mx-auto grid gap-8 lg:grid-cols-12 lg:items-start">
              <div className="lg:col-span-5">
                <header>
                  <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                    Gửi yêu cầu nhanh
                  </p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                    Floring sẽ liên hệ để lên lịch khảo sát
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-zinc-600">
                    Điền thông tin cơ bản. Chúng tôi sẽ phản hồi để xác nhận thời gian khảo sát và tư vấn phương án phù hợp.
                  </p>
                </header>

                <div className="mt-8 space-y-3">
                  {CONTACT_HIGHLIGHTS.map((x) => (
                    <div
                      key={x}
                      className="flex items-start gap-3 rounded-2xl border border-zinc-200/60 bg-white/80 p-4 shadow-sm backdrop-blur"
                    >
                      <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                        ✓
                      </span>
                      <p className="text-sm leading-6 text-zinc-600">{x}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-zinc-200/60 bg-white/80 p-8 shadow-sm backdrop-blur">
                  <ContactRequestForm
                    className="grid gap-4"
                    submitLabel="Gửi yêu cầu khảo sát"
                  />
                </div>
              </div>
            </div>
          </Container>
        </RevealOnScroll>
      </section>
    </main>
  );
}
