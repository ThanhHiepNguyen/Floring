import { Metadata } from 'next';
import { Container } from '@/components/Container';
import { ServiceContactRequestForm } from '@/components/service/ServiceContactRequestForm';

export const metadata: Metadata = {
  title: 'About - Floring Melbourne | Flooring Installation',
  description:
    'Floring is a trusted flooring contractor in Melbourne (Australia), specializing in installation, repair, and maintenance for residential and commercial spaces.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-transparent text-foreground">
      <section className="bg-gradient-to-b from-transparent via-slate-50/60 to-transparent py-14">
        <Container>
          <div className="mx-auto max-w-6xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
              About Floring
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Trusted flooring installation team in Melbourne
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              Floring supports your project end-to-end, from material consultation and professional
              installation to post-installation care guidance. We focus on three core values:
              clean execution, clear communication, and long-lasting quality finishes.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-gradient-to-b from-transparent via-white to-transparent py-16">
        <Container>
          <article className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                Who we are
              </h2>
              <p className="mt-6 text-base leading-relaxed text-zinc-600">
                Floring is a Melbourne-based flooring team with hands-on experience across
                residential and commercial projects. We install timber, hybrid, and laminate
                flooring to proven installation standards.
              </p>
              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                Whether you are upgrading one room or delivering a full project, our process stays clear
                and predictable: scope, timeline, and expectations are aligned from day one. The result is
                a modern, polished finish with practical aftercare guidance for long-term confidence.
              </p>
            </div>

            <div className="relative lg:col-span-6">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
                <svg
                  viewBox="0 0 1200 900"
                  className="h-full w-full"
                  preserveAspectRatio="xMidYMid slice"
                  aria-hidden="true"
                  focusable="false"
                >
                  <defs>
                    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#fff8ee" />
                      <stop offset="50%" stopColor="#f4efe6" />
                      <stop offset="100%" stopColor="#efe7db" />
                    </linearGradient>
                    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#d8b687" />
                      <stop offset="40%" stopColor="#caa16f" />
                      <stop offset="70%" stopColor="#e0c093" />
                      <stop offset="100%" stopColor="#b98c59" />
                    </linearGradient>
                    <pattern id="planks" width="190" height="60" patternUnits="userSpaceOnUse">
                      <rect width="190" height="60" fill="url(#wood)" opacity="0.9" />
                      <path
                        d="M0,30 C25,22 45,40 70,30 C95,20 115,42 140,30 C165,18 180,36 190,28"
                        fill="none"
                        stroke="#8b5a2b"
                        strokeWidth="2"
                        opacity="0.25"
                      />
                      <g opacity="0.22" stroke="#6f3f1d" strokeWidth="1">
                        <line x1="15" y1="10" x2="30" y2="55" />
                        <line x1="70" y1="8" x2="92" y2="56" />
                        <line x1="125" y1="12" x2="145" y2="55" />
                      </g>
                      <path
                        d="M0,0 L190,0 L190,60 L0,60 Z"
                        fill="none"
                        stroke="#6f3f1d"
                        strokeWidth="1"
                        opacity="0.18"
                      />
                    </pattern>
                    <radialGradient id="vignette" cx="50%" cy="30%" r="70%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
                      <stop offset="70%" stopColor="#000000" stopOpacity="0.0" />
                      <stop offset="100%" stopColor="#000000" stopOpacity="0.14" />
                    </radialGradient>
                  </defs>

                  <rect width="1200" height="900" fill="url(#bg)" />
                  <g transform="rotate(-8 600 450)">
                    <rect width="1200" height="900" fill="url(#planks)" opacity="0.95" />
                    {/* subtle diagonal joints */}
                    <g opacity="0.18" stroke="#5a2f14" strokeWidth="2">
                      {Array.from({ length: 16 }).map((_, i) => {
                        const x = i * 95 - 80;
                        return (
                          <line
                            key={i}
                            x1={x}
                            y1={-40}
                            x2={x + 240}
                            y2={980}
                          />
                        );
                      })}
                    </g>
                  </g>
                  <rect width="1200" height="900" fill="url(#vignette)" />
                </svg>
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/90 to-transparent" />
            </div>
          </article>
        </Container>
      </section>

      <section className="bg-gradient-to-b from-transparent via-slate-50/70 to-transparent py-16">
        <Container>
          <header className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Service standards
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600">
              We provide contractor-grade flooring services designed for Australian project conditions
              and client expectations, with quality checks at every stage.
            </p>
          </header>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <article className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-zinc-900">What we deliver</h3>
              <p className="mt-4 text-zinc-600">
                End-to-end flooring solutions built on clear communication and consistent craftsmanship.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    ✓
                  </span>
                  <span>Timber floor installation and replacement</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    ✓
                  </span>
                  <span>Sanding, restoration, and surface refinishing</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    ✓
                  </span>
                  <span>Support for residential and commercial projects</span>
                </li>
              </ul>
            </article>

            <article className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-zinc-900">How we work</h3>
              <p className="mt-4 text-zinc-600">
                Every project is executed with a practical plan, strong safety focus, and attention to
                the details that create meaningful quality.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    ✓
                  </span>
                  <span>Site survey and floor preparation</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    ✓
                  </span>
                  <span>Transparent quotation and realistic timeline</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    ✓
                  </span>
                  <span>After-installation guidance and maintenance tips</span>
                </li>
              </ul>
            </article>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-slate-100/70 via-emerald-50/50 to-slate-100/70 py-16">
        <Container>
          <div className="mx-auto max-w-6xl rounded-3xl border border-zinc-200/70 bg-white/70 p-8 shadow-sm backdrop-blur">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="text-center md:text-left">
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                  Contact
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                  Tell us your needs — Floring will guide the next step.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-zinc-600">
                  Share your requirements and, if needed, upload site photos so our team can assess the project
                  and prepare a clear execution plan.
                </p>
              </div>

              <div className="w-full md:w-auto">
                <ServiceContactRequestForm
                  mode="dialog"
                  serviceId={null}
                  serviceName={null}
                  productVariantId={null}
                  triggerLabel="Contact"
                  triggerVariant="form"
                  triggerClassName="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 md:w-auto"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-gradient-to-b from-transparent via-white to-transparent py-16">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Why clients choose Floring
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600">
              Floring combines reliable scheduling, technical expertise, and premium finishing quality to deliver
              trustworthy flooring projects from first contact to handover and long-term support.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Contractor-grade quality',
                description:
                  'Installation to contractor-level standards with careful quality checks at every stage.',
              },
              {
                title: 'Clear communication',
                description:
                  'You receive clear updates on scope, timeline, and budget throughout delivery.',
              },
              {
                title: 'On schedule',
                description:
                  'Our structured process helps minimize surprises and achieve on-time handover.',
              },
              {
                title: 'After-installation support',
                description:
                  'We provide practical maintenance guidance so your flooring stays in top condition over time.',
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-zinc-900">
                  {item.title}
                </h3>
                <p className="mt-3 text-zinc-600">{item.description}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-gradient-to-b from-transparent via-slate-50/60 to-transparent pb-16">
        <Container>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <article className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm lg:col-span-5">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                Visit our Melbourne office
              </h2>
              <p className="mt-4 text-zinc-600">
                Floring Australia Pty Ltd
              </p>
              <p className="mt-2 text-zinc-600">
                Level 8, 456 Collins Street, Melbourne VIC 3000, Australia
              </p>
              <p className="mt-2 text-zinc-600">Mon - Sat: 8:00 AM - 6:00 PM</p>
              <a
                href="https://maps.google.com/?q=456+Collins+Street,+Melbourne+VIC+3000,+Australia"
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-700"
              >
                Open in Google Maps
              </a>
            </article>

            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm lg:col-span-7">
              <iframe
                title="Floring Melbourne location map"
                src="https://www.google.com/maps?q=456+Collins+Street,+Melbourne+VIC+3000,+Australia&output=embed"
                className="h-[420px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}
