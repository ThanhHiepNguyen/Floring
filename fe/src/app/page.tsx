import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { LuxurySlideshow } from '@/components/home/LuxurySlideshow';
import { Container } from '@/components/Container';
import { backendGet } from '@/lib/backend';
import { getBlogPosts } from '@/api/blog.api';
import { ContactRequestForm } from '@/components/contact/ContactRequestForm';
import { RevealOnScroll } from '@/components/animation/RevealOnScroll';
import { BlogCarouselSection } from '@/components/home/BlogCarouselSection';
import { ServicesTabsSection } from '@/components/home/ServicesTabsSection';
import type {
  FAQItem,
  HomeProject,
  HomeProjectsResponse,
  HomeServiceListResponse,
  ProcessStep,
  QualityItem,
  Testimonial,
} from '@/types/home';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { normalizeImageUrl } from '@/lib/asset';

const PROCESS_STEPS: ProcessStep[] = [
  {
    step: '01',
    title: 'Receive request',
    desc: 'Share your request and preferred service/color samples. Floring confirms details to prepare the site survey.',
  },
  {
    step: '02',
    title: 'Site survey & consultation',
    desc: 'Our technical team reviews current conditions and recommends the best installation plan for your space.',
  },
  {
    step: '03',
    title: 'Plan & quotation',
    desc: 'Finalize scope, materials, and timeline. You get clear visibility on milestones, costs, and possible extras.',
  },
  {
    step: '04',
    title: 'Standardized installation',
    desc: 'Work is executed to technical standards with quality checks at each stage for durability and finish.',
  },
  {
    step: '05',
    title: 'Handover & warranty',
    desc: 'We provide cleaning/maintenance guidance and post-installation support to keep your floor in top shape.',
  },
  {
    step: '06',
    title: 'Aftercare support',
    desc: 'If you have questions or need maintenance, Floring is here to help maintain long-term performance.',
  },
];

const QUALITY_ITEMS: QualityItem[] = [
  {
    title: 'Right material fit',
    desc: 'Recommendations aligned with climate conditions and real-world usage requirements.',
  },
  {
    title: 'Installation quality',
    desc: 'Tight control over preparation, installation, and final surface finishing.',
  },
  {
    title: 'Maintenance & support',
    desc: 'Practical guidance for cleaning and common issues to preserve long-term floor quality.',
  },
];

const FAQ_ITEMS: FAQItem[] = [
  {
    q: 'What types of flooring does Floring install?',
    a: 'Floring provides installation solutions for timber floors, LVT, and SPC flooring. Based on site conditions, our team recommends the most suitable material.',
  },
  {
    q: 'How long do survey and installation take?',
    a: 'The exact duration depends on project scope and site condition. After survey, Floring provides a clear timeline and progress updates throughout the project.',
  },
  {
    q: 'Do you provide post-installation warranty?',
    a: 'Yes. Floring supports after handover and provides maintenance guidance. Warranty terms are clearly stated in the quotation based on scope.',
  },
  {
    q: 'What should I prepare before your team arrives?',
    a: 'You only need to share your requirements and current site status. Our team will guide all required preparation steps for a smooth installation.',
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
      "Strong communication and careful installation. We're happy with both the look and the feel of the floor.",
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
  'Reply within 1 business day',
  'Clear consultation on materials and workflow',
  'Support for planning your installation',
] as const;

export const metadata: Metadata = {
  title: 'Floring | Timber Flooring - LVT - SPC',
  description: 'Floring provides high-quality flooring installation and long-term maintenance solutions.',
};

export default async function Home() {
  const servicesRes = await backendGet<HomeServiceListResponse>('/service', {
    searchParams: { page: 1, limit: 6 },
  }).catch(() => null);
  const services = servicesRes?.data ?? [];

  // Fetch more posts so carousel can loop smoothly
  const blogRes = await getBlogPosts(1, 12).catch(() => null);
  const blogPosts = blogRes?.data ?? [];

  const projectsRes = await backendGet<HomeProjectsResponse>('/project', {

    searchParams: { page: 1, limit: 5 },
  }).catch(() => null);
  const projects = (projectsRes?.data ?? []).slice(0, 5);


  const HERO_KPIS = [
    { label: 'Completed projects', value: `${Math.max(projects.length * 17, 60)}+` },
    { label: 'Flooring options advised', value: `${Math.max(services.length * 12, 24)}+` },
    { label: 'Response time', value: 'Within 24h' },
  ] as const;

  const renderProjectMosaicCard = (p: HomeProject, aspectClass: string) => {
    const cover = p.images?.[0]?.imageUrl;

    return (
      <article className="group w-full overflow-hidden rounded-2xl">
        <Link href={`/projects/${p.slug}`} className="block">
          <div className={`relative w-full ${aspectClass} bg-zinc-100`}>
            {cover ? (
              <Image
                src={normalizeImageUrl(cover)}
                alt={p.title}
                fill
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, 33vw"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-zinc-200" />
            )}


            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />

            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-sm font-semibold tracking-tight text-white/95">
                {p.title}
              </h3>
              {p.location ? (
                <p className="mt-1 text-xs font-medium text-white/80">
                  {p.location}
                </p>
              ) : null}
            </div>
          </div>
        </Link>
      </article>
    );
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      <section className="relative overflow-hidden border-b border-zinc-200/70 pb-16 pt-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,rgba(16,185,129,0.14),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(59,130,246,0.14),transparent_45%),linear-gradient(to_bottom,rgba(255,255,255,0.92),rgba(248,250,252,1))]" />
        <Container>
          <RevealOnScroll effect="fade">
            <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Floring Signature
                </span>
                <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
                  Premium spaces begin with refined flooring
                </h1>
                <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
                  High-standard flooring design and installation, with materials matched to your style for standout apartments, showrooms, and offices.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/projects"
                    className="inline-flex items-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                  >
                    View projects
                  </Link>
                  <Link
                    href="/services"
                    className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
                  >
                    View services
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 flex justify-center">
                <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_30px_120px_-60px_rgba(2,6,23,0.25)]">
                  <LuxurySlideshow intervalMs={4200} variant="hero" imageOnly />
                </div>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll effect="up" delayMs={80}>
            <div className="relative z-10 mt-8 hidden gap-4 sm:grid sm:grid-cols-3">
              {HERO_KPIS.map((kpi) => (
                <article
                  key={kpi.label}
                  className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-zinc-900">{kpi.value}</p>
                </article>
              ))}
            </div>
          </RevealOnScroll>
        </Container>
      </section>

      <section className="relative overflow-hidden border-b border-zinc-200/70 bg-slate-50 py-16">
        <RevealOnScroll effect="left" delayMs={80}>
          <Container>
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-emerald-200/50 blur-3xl" />
              <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl" />
            </div>

            <div className="mx-auto max-w-4xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.26em] text-emerald-700">
                Curated Services
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
                Choose the right flooring solution for your aesthetic and the experience you want your space to deliver
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                Floring does more than supply flooring. We help you choose the right material, feel, and investment level to elevate your overall space.
              </p>
            </div>

            <div className="mx-auto mt-10 max-w-4xl">
              {services.length ? (
                <div className="rounded-[2rem] border border-zinc-200 bg-white p-4 shadow-sm sm:p-6">
                  <div className="relative mb-5 flex items-center justify-center gap-4 px-2">
                    <div className="text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
                        Explore services
                      </p>
                    </div>
                    <Link
                      href="/services"
                      className="hidden rounded-full border border-zinc-200 bg-white px-5 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50 sm:absolute sm:right-2 sm:top-1/2 sm:inline-flex sm:-translate-y-1/2"
                    >
                      View all
                    </Link>
                  </div>
                  <ServicesTabsSection services={services} />
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
                  No services are available to display yet.
                </div>
              )}
            </div>
          </Container>
        </RevealOnScroll>
      </section>
      <section className="bg-white py-16">
        <RevealOnScroll effect="zoom" delayMs={60}>
          <Container>
            <header className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-sky-300">
                Featured projects
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                Real spaces completed by our team
              </h2>
              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                Browse visual references and discover the finishing style Floring delivers.
              </p>
            </header>

            {projects.length ? (
              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:grid-rows-2 sm:gap-6">
                <div className="sm:col-start-1 sm:row-start-1">
                  {projects[0] ? renderProjectMosaicCard(projects[0], 'aspect-[16/10]') : null}
                </div>

                <div className="sm:col-start-1 sm:row-start-2">
                  {projects[1] ? renderProjectMosaicCard(projects[1], 'aspect-[16/11]') : null}
                </div>

                <div className="flex w-full items-center sm:col-start-2 sm:row-start-1 sm:row-span-2">
                  {projects[2] ? renderProjectMosaicCard(projects[2], 'aspect-[4/5]') : null}
                </div>

                <div className="sm:col-start-3 sm:row-start-1">
                  {projects[3] ? renderProjectMosaicCard(projects[3], 'aspect-[16/10]') : null}
                </div>

                <div className="sm:col-start-3 sm:row-start-2">
                  {projects[4] ? renderProjectMosaicCard(projects[4], 'aspect-[16/12]') : null}
                </div>
              </div>
            ) : (
              <div className="mt-12 rounded-2xl border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
                No projects are available to display yet.
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link
                href="/projects"
                className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50"
              >
                View all projects <span className="ml-2">→</span>
              </Link>
            </div>
          </Container>
        </RevealOnScroll>
      </section>

      <section className="bg-slate-50 py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-12 lg:items-stretch">
            <RevealOnScroll effect="up" delayMs={40} className="w-full lg:col-span-4">
              <div className="flex h-full flex-col rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:p-7">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-700">Execution Steps</p>
                <h3 className="mt-3 max-w-sm text-3xl font-semibold tracking-tight text-zinc-900">
                  Step-by-step quality control process
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-600">
                  Each step includes checklists, records, and clear technical coordination to reduce errors and optimize schedule.
                </p>
                <div className="mt-6 space-y-3 lg:mt-8">
                  {QUALITY_ITEMS.map((item) => (
                    <div key={item.title} className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 lg:p-5">
                      <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
                      <p className="mt-1 text-xs leading-6 text-zinc-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll effect="right" delayMs={100} className="w-full lg:col-span-8">
              <ol className="grid h-full gap-4 md:grid-cols-2">
                {PROCESS_STEPS.map((item) => (
                  <li key={item.step} className="flex h-full min-h-[150px] flex-col rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm lg:min-h-[164px]">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white">
                      {item.step}
                    </span>
                    <h4 className="mt-4 text-base font-semibold text-zinc-900">{item.title}</h4>
                    <p className="mt-2 text-sm leading-6 text-zinc-600">{item.desc}</p>
                  </li>
                ))}
              </ol>
            </RevealOnScroll>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden border-y border-zinc-200/70 bg-white py-16">
        <RevealOnScroll effect="fade">
          <Container>
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute left-0 top-12 h-72 w-72 rounded-full bg-teal-200/60 blur-3xl" />
              <div className="absolute right-0 top-1/3 h-80 w-80 rounded-full bg-indigo-200/60 blur-3xl" />
            </div>
            <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-10">
              <div className="hidden lg:col-span-4 lg:block">
                <div className="sticky top-24 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_24px_70px_-50px_rgba(2,6,23,0.15)]">
                  <div className="pointer-events-none absolute inset-x-10 top-0 h-24 rounded-full bg-emerald-200/40 blur-3xl" />
                  <Image
                    src="/FAQ.png"
                    alt="Floring support"
                    width={420}
                    height={420}
                    className="relative z-10 h-auto w-full object-contain"
                  />
                </div>
              </div>
              <div className="lg:col-span-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">FAQ</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
                  Quick answers to help you decide faster
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-600 sm:text-base">
                  The most common questions about survey, installation, and warranty so you can understand the process before getting started.
                </p>
                <div className="mt-8 space-y-3">
                  {FAQ_ITEMS.map((item) => (
                    <details
                      key={item.q}
                      className="group rounded-2xl border border-zinc-200 bg-white px-5 py-4 shadow-sm transition-colors hover:bg-zinc-50 sm:px-6"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold text-zinc-900">
                        <span>{item.q}</span>
                        <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition duration-200 group-open:rotate-45 group-open:border-emerald-200 group-open:bg-emerald-50 group-open:text-emerald-700">
                          +
                        </span>
                      </summary>
                      <p className="mt-3 border-t border-zinc-200 pt-3 text-sm leading-7 text-zinc-600">{item.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </RevealOnScroll>
      </section>

      <section className="bg-slate-50 py-16">
        <RevealOnScroll effect="blur">
          <Container>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-600">Client Voice</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                  Credibility proven by real customer experiences
                </h2>
                <p className="mt-4 max-w-sm text-sm leading-7 text-zinc-600">
                  Real feedback from clients after consultation, installation, and completion.
                </p>
              </div>
              <div className="lg:col-span-8">
                <TestimonialsSection testimonials={TESTIMONIALS} initialCount={3} />
              </div>
            </div>
          </Container>
        </RevealOnScroll>
      </section>

      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.10),transparent_32%),linear-gradient(135deg,#ffffff_0%,#f8fafc_52%,#ffffff_100%)] py-16">
        <RevealOnScroll effect="blur" delayMs={100}>
          <Container>
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-5">
                <div className="max-w-xl rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_24px_80px_-60px_rgba(2,6,23,0.18)] sm:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-700">Book a consultation</p>
                  <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                    Book a free survey and get expert guidance on the best flooring structure
                  </h2>
                  <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-600 sm:text-base">
                    Floring helps define the right installation approach from day one, from material selection to timeline and execution.
                  </p>
                  <div className="mt-6 space-y-3">
                    {CONTACT_HIGHLIGHTS.map((x) => (
                      <div key={x} className="flex items-start gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">✓</span>
                        <p className="text-sm text-zinc-700">{x}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-7">
                <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-[0_30px_90px_-60px_rgba(2,6,23,0.20)] sm:p-8">
                  <ContactRequestForm className="grid gap-4" submitLabel="Send survey request" />
                </div>
              </div>
            </div>
          </Container>
        </RevealOnScroll>
      </section>

      <section className="bg-white py-16">
        <RevealOnScroll effect="left">
          <Container>
            <div className="mb-7 flex items-end justify-between gap-4">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-900">Blog</h2>
              <Link href="/blogs" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                View all posts
              </Link>
            </div>
            {blogPosts.length ? (
              <BlogCarouselSection
                posts={blogPosts.map((p) => ({
                  id: p.id,
                  slug: p.slug,
                  title: p.title,
                  excerpt: p.excerpt,
                  imageUrl: p.imageUrl,
                  createdAt: p.createdAt,
                  author: 'Floring',
                  category: 'News',
                }))}
              />
            ) : null}
          </Container>
        </RevealOnScroll>
      </section>
    </main>
  );
}







