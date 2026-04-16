import { Metadata } from 'next';

import { Container } from '@/components/Container';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ContactRequestForm } from '@/components/contact/ContactRequestForm';

export const metadata: Metadata = {
  title: 'Contact | Floring',
  description: 'Send your survey and installation request. Floring will contact you for consultation and scheduling.',
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-zinc-200 bg-white py-10">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Home', href: '/' }, { label: 'Contact' }]}
          />
          <header className="mt-6">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Contact Floring
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Fill in the form below. Floring will respond to confirm your survey schedule and the best installation plan.
            </p>
          </header>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="mx-auto max-w-2xl rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <ContactRequestForm
              className="grid gap-4"
              submitLabel="Send survey request"
            />
          </div>
        </Container>
      </section>
    </main>
  );
}

