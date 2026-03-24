import { Metadata } from 'next';

import { Container } from '@/components/Container';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ContactRequestForm } from '@/components/contact/ContactRequestForm';

export const metadata: Metadata = {
  title: 'Liên hệ | Floring',
  description: 'Gửi yêu cầu khảo sát & thi công. Floring sẽ liên hệ tư vấn và lên lịch sớm nhất.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-zinc-200 bg-white py-10">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Liên hệ' }]}
          />
          <header className="mt-6">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Liên hệ Floring
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Điền thông tin bên dưới. Floring sẽ phản hồi để xác nhận lịch khảo sát & lên phương án thi công sớm nhất.
            </p>
          </header>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <ContactRequestForm
              className="grid gap-4"
              submitLabel="Gửi yêu cầu khảo sát"
            />
          </div>
        </Container>
      </section>
    </main>
  );
}

