import type { Metadata } from 'next';
import { getBlogPosts } from '@/api/blog.api';
import { backendGet } from '@/lib/backend';
import { FeaturedListing } from '@/components/listing/FeaturedListing';
import type { FeaturedItem } from '@/types/listing';
import type { BlogListResponse } from '@/api/blog.api';

export const metadata: Metadata = {
  title: 'Blog Floring - Kien thuc san go, LVT, SPC',
  description:
    'Cap nhat kien thuc ve san go, LVT va SPC: cach chon vat lieu, thi cong chuan ky thuat va bao duong de san ben dep lau dai.',
};

const EMPTY_BLOG_LIST_RESPONSE: BlogListResponse = {
  data: [],
  totalItems: 0,
  totalPages: 0,
  page: 1,
  limit: 12,
};

export default async function BlogIndexPage() {
  const primary = await getBlogPosts(1, 12).catch(() => EMPTY_BLOG_LIST_RESPONSE);
  const fallback =
    primary.data.length === 0
      ? await backendGet<BlogListResponse>('/blog/public', {
          searchParams: { page: 1, limit: 12 },
        }).catch(() => EMPTY_BLOG_LIST_RESPONSE)
      : null;

  const posts = (fallback?.data?.length ? fallback.data : primary.data) ?? [];
  const featured = posts[0] as FeaturedItem | undefined;
  const curated = posts.slice(1, 6) as FeaturedItem[];
  const recent = posts.slice(0, 9) as FeaturedItem[];

  return (
    <FeaturedListing
      heading="Blog"
      featured={featured}
      curated={curated}
      recent={recent}
      basePath="/blogs"
      recentHeading="Recent Posts"
      curatedHeading="Other featured posts"
      allLinkLabel="All posts"
    />
  );
}
