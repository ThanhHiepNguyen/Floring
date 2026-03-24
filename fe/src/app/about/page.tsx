import { Metadata } from 'next';
import { Container } from '@/components/Container';
import { ServiceContactRequestForm } from '@/components/service/ServiceContactRequestForm';

export const metadata: Metadata = {
  title: 'Giới thiệu - Floring Melbourne | Thi công sàn gỗ',
  description:
    'Floring là đơn vị thi công sàn gỗ uy tín tại Melbourne (Australia), chuyên lắp đặt, sửa chữa và bảo trì sàn gỗ cho căn hộ và không gian thương mại.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-transparent text-foreground">
      <section className="bg-gradient-to-b from-transparent via-slate-50/60 to-transparent py-14">
        <Container>
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-amber-600">
              Giới thiệu Floring
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl">
              Đơn vị thi công sàn gỗ uy tín tại Melbourne
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              Floring đồng hành toàn diện từ tư vấn chọn vật liệu, thi công chuyên nghiệp đến hướng
              dẫn chăm sóc/bảo trì sau lắp đặt. Chúng tôi tập trung vào 3 yếu tố xuyên suốt:
              thi công sạch sẽ, trao đổi rõ ràng và hoàn thiện bền đẹp theo thời gian.
            </p>
          </div>
        </Container>
      </section>

      <section className="bg-gradient-to-b from-transparent via-white to-transparent py-16">
        <Container>
          <article className="grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-6">
              <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
                Chúng tôi là ai
              </h2>
              <p className="mt-6 text-base leading-relaxed text-zinc-600">
                Floring là đội ngũ thi công sàn gỗ tại Melbourne với kinh nghiệm thực tế triển khai
                cả dự án dân dụng và thương mại. Chúng tôi lắp đặt sàn gỗ timber, sàn hybrid và sàn
                laminate theo tiêu chuẩn thi công đã được kiểm chứng.
              </p>
              <p className="mt-4 text-base leading-relaxed text-zinc-600">
                Cho dù bạn nâng cấp một phòng hay thực hiện cả công trình, quy trình luôn rõ ràng và
                dễ dự đoán: scope, timeline và kỳ vọng được trao đổi từ đầu. Kết quả là một bề mặt
                hiện đại, hoàn thiện tinh gọn — kèm hướng dẫn sau thi công để bạn yên tâm sử dụng lâu dài.
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
          <header className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Tiêu chuẩn dịch vụ
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600">
              Chúng tôi cung cấp dịch vụ thi công sàn gỗ tiêu chuẩn “nhà thầu” — phù hợp điều kiện
              công trình tại Australia và đúng kỳ vọng của khách hàng, với kiểm tra chất lượng ở mọi giai đoạn.
            </p>
          </header>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <article className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-zinc-900">Chúng tôi mang đến</h3>
              <p className="mt-4 text-zinc-600">
                Giải pháp thi công sàn trọn gói dựa trên giao tiếp rõ ràng và tay nghề ổn định.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    ✓
                  </span>
                  <span>Thi công & thay thế sàn gỗ timber</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    ✓
                  </span>
                  <span>Chà nhám, phục hồi & tân trang bề mặt</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    ✓
                  </span>
                  <span>Hỗ trợ dự án dân dụng & thương mại</span>
                </li>
              </ul>
            </article>

            <article className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-zinc-900">Cách chúng tôi làm việc</h3>
              <p className="mt-4 text-zinc-600">
                Mỗi dự án đều được triển khai với kế hoạch thực tế, chú trọng an toàn và tập trung vào những chi tiết
                tạo nên khác biệt.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-zinc-600">
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    ✓
                  </span>
                  <span>Khảo sát hiện trạng & chuẩn bị mặt bằng</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    ✓
                  </span>
                  <span>Báo giá minh bạch & timeline hợp lý</span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
                    ✓
                  </span>
                  <span>Hướng dẫn sau thi công & mẹo bảo dưỡng</span>
                </li>
              </ul>
            </article>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-slate-100/70 via-emerald-50/50 to-slate-100/70 py-16">
        <Container>
          <div className="mx-auto max-w-4xl rounded-3xl border border-zinc-200/70 bg-white/70 p-8 shadow-sm backdrop-blur">
            <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
              <div className="text-center md:text-left">
                <p className="text-sm font-semibold uppercase tracking-widest text-emerald-700">
                      Yêu cầu khảo sát & nhận báo giá
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">
                      Cho chúng tôi biết nhu cầu — Floring sẽ hướng dẫn bước tiếp theo.
                </h2>
                <p className="mt-4 text-base leading-relaxed text-zinc-600">
                      Chia sẻ thông tin về nhu cầu của bạn và (nếu cần) upload ảnh hiện trạng để đội ngũ đánh giá công trình
                      và lên kế hoạch rõ ràng.
                </p>
              </div>

              <div className="w-full md:w-auto">
                <ServiceContactRequestForm
                  mode="dialog"
                  serviceId={null}
                  serviceName={null}
                  productVariantId={null}
                  triggerLabel="Yêu cầu khảo sát & báo giá"
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
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Vì sao khách hàng chọn Floring
            </h2>
            <p className="mt-4 text-base leading-relaxed text-zinc-600">
              Floring kết hợp lịch triển khai đáng tin cậy, chuyên môn kỹ thuật và chất lượng hoàn thiện cao cấp để mang đến
              những dự án thi công sàn “đáng tin” — từ lần liên hệ đầu tiên đến bàn giao và hỗ trợ duy trì bền đẹp.
            </p>
          </div>

          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Chất lượng chuẩn nhà thầu',
                description:
                  'Thi công theo tiêu chuẩn chuẩn nhà thầu, kèm kiểm tra chất lượng cẩn thận trong từng giai đoạn.',
              },
              {
                title: 'Trao đổi rõ ràng',
                description:
                  'Bạn sẽ nhận được cập nhật rõ ràng về scope, timeline và ngân sách trong suốt quá trình thực hiện.',
              },
              {
                title: 'Đúng tiến độ',
                description:
                  'Đội ngũ theo quy trình có cấu trúc để hạn chế phát sinh và bàn giao đúng lịch.',
              },
              {
                title: 'Hỗ trợ sau thi công',
                description:
                  'Chúng tôi cung cấp hướng dẫn bảo dưỡng thực tế để sàn luôn ở trạng thái tốt nhất theo thời gian.',
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
                Đến văn phòng Melbourne
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
                Mở Google Maps
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
