'use client';

import Link from 'next/link';

import { Container } from '@/components/Container';

const companyLinks = [
    { href: '/about', label: 'Giới thiệu' },
    { href: '/projects', label: 'Dự án' },
    { href: '/blogs', label: 'Blog' },
];



export function Footer() {
    return (
        <footer className="border-t border-slate-200 bg-slate-950 text-slate-200 dark:border-slate-800 dark:bg-slate-950">

            <Container className="py-12">
                <div className="grid gap-10 text-center lg:grid-cols-12 lg:items-start lg:text-left">
                    {/* Brand */}
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-center gap-2 lg:justify-start">
                            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-500 text-sm font-semibold text-white">
                                F
                            </span>
                            <div className="text-sm font-semibold tracking-tight text-white">
                                Floring
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-300">
                            Tư vấn vật liệu sàn phù hợp, thi công đúng kỹ thuật, nghiệm thu rõ
                            ràng và bảo hành minh bạch.
                        </p>
                    </div>


                    <div className="lg:col-span-2">
                        <div className="text-sm font-semibold text-white">
                            Liên kết
                        </div>
                        <ul className="mt-4 space-y-2 text-sm">
                            {companyLinks.map((l) => (
                                <li key={l.href}>
                                    <Link
                                        href={l.href}
                                        className="text-slate-300 hover:text-emerald-300"
                                    >
                                        {l.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="lg:col-span-3">
                        <div className="text-sm font-semibold text-white">
                            Thông tin liên hệ
                        </div>
                        <div className="mt-4 space-y-3 text-sm text-slate-300">
                            <div className="flex items-start justify-center gap-2 lg:justify-start">
                                <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                                        <path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11Z" />
                                        <circle cx="12" cy="10" r="2.5" />
                                    </svg>
                                </span>
                                <div>Australia</div>
                            </div>
                            <div className="flex items-start justify-center gap-2 lg:justify-start">
                                <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                                        <path d="M4 4h16v16H4z" opacity="0" />
                                        <path d="M4 6l8 6 8-6" />
                                        <path d="M4 18h16V6H4z" />
                                    </svg>
                                </span>
                                <a className="hover:text-emerald-300" href="mailto:hello@floring.vn">
                                    hello@floring.vn
                                </a>
                            </div>
                            <div className="flex items-start justify-center gap-2 lg:justify-start">
                                <span className="mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-slate-800 text-slate-200">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                                        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2Z" />
                                    </svg>
                                </span>
                                <div>+61 000 000 000</div>
                            </div>

                            <div className="mt-4 flex items-center justify-center gap-2 lg:justify-start">
                                <a
                                    href="#"
                                    aria-label="Facebook"
                                    className="inline-flex size-9 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-emerald-600"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                        <path d="M13.5 22v-7.5h2.5l.4-3h-2.9V9.4c0-.9.3-1.5 1.6-1.5H16V5.2c-.8-.1-1.8-.2-3-.2-2.9 0-4.9 1.8-4.9 5v1.5H5.8v3h2.3V22h5.4Z" />
                                    </svg>
                                </a>

                                <a
                                    href="#"
                                    aria-label="Instagram"
                                    className="inline-flex size-9 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-emerald-600"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="size-4"
                                    >
                                        <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
                                        <path d="M16 11.5a4 4 0 1 1-7.8 1.2" />
                                        <path d="M17.6 6.4h.01" />
                                    </svg>
                                </a>

                                <a
                                    href="#"
                                    aria-label="WhatsApp"
                                    className="inline-flex size-9 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-emerald-600"
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="size-4"
                                    >
                                        <path d="M20 11.6a8 8 0 0 1-11.7 7L4 20l1.5-4.1A8 8 0 1 1 20 11.6Z" />
                                        <path d="M9.1 9.6c.2 2 2.4 4.7 4.4 5.3.7.2 1.7-.2 2.1-.9l.3-.6c.2-.5 0-1-.5-1.2l-1.4-.7c-.4-.2-.9 0-1.2.4l-.2.3c-.2.3-.6.4-.9.3-1-.4-2.2-1.7-2.7-2.7-.1-.3 0-.7.3-.9l.3-.2c.4-.3.6-.8.4-1.2l-.7-1.4c-.2-.5-.7-.7-1.2-.5l-.6.3c-.7.4-1.1 1.4-.9 2.1Z" />
                                    </svg>
                                </a>

                                <a
                                    href="#"
                                    aria-label="YouTube"
                                    className="inline-flex size-9 items-center justify-center rounded-full bg-slate-800 text-white hover:bg-emerald-600"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                        <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31 31 0 0 0 2 12s.1 3.7.4 4.8a3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1c.3-1.1.4-4.8.4-4.8s-.1-3.7-.4-4.8ZM10.2 15.3V8.7L15.9 12l-5.7 3.3Z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Quick CTA */}
                    <div className="lg:col-span-4">
                        <div className="text-sm font-semibold text-white">
                            Liên hệ nhanh
                        </div>
                        <div className="mt-4 rounded-2xl border border-slate-700 bg-slate-900 p-4 shadow-sm backdrop-blur">
                            <p className="text-sm leading-6 text-slate-200">
                                Bạn muốn nhận tư vấn đúng nhu cầu? Chỉ cần bấm nút để gửi yêu cầu khảo sát,
                                Floring sẽ liên hệ sớm nhất.
                            </p>

                            <div className="mt-4 flex flex-wrap gap-3 lg:flex-nowrap lg:gap-2">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                                >
                                    Gửi yêu cầu
                                </Link>

                                <Link
                                    href="/projects"
                                    className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-100 shadow-sm transition hover:bg-slate-700"
                                >
                                    Xem dự án
                                </Link>
                            </div>

                            <div className="mt-4 text-xs text-slate-400">
                                Phản hồi thường trong vòng 1 ngày làm việc.
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-slate-800 pt-6 text-center text-xs text-slate-400">
                    © {new Date().getFullYear()} Floring. All rights reserved.
                </div>
            </Container>
        </footer>
    );
}

