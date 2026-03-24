import { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/Container';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Yêu thích | Floring',
  description: 'Danh sách sản phẩm yêu thích (sắp có).',
};

export default function FavoritesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-zinc-200 bg-white py-10">
        <Container>
          <Breadcrumbs
            items={[{ label: 'Trang chủ', href: '/' }, { label: 'Yêu thích' }]}
          />
          <header className="mt-6">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
              Yêu thích
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Tính năng này sẽ được bổ sung sau. Bạn có thể quay lại trang chủ hoặc
              duyệt danh mục để xem sản phẩm.
            </p>
          </header>
        </Container>
      </section>

      <section className="py-12">
        <Container>
          <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="text-sm text-zinc-700">
              Chưa có sản phẩm yêu thích.
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Về trang chủ
              </Link>
              <Link
                href="/search"
                className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
              >
                Tìm sản phẩm
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </main>
  );
}

