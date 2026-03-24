import { redirect } from 'next/navigation';

export default function CategoryLegacyRedirect({
  params,
}: {
  params: { slug: string };
}) {
  // BE đã bỏ model Category; slug cũ được chuyển về trang tìm kiếm.
  redirect('/search');
}

