import type { Metadata } from 'next';
import { getBlogPosts } from '@/api/blog.api';
import { FeaturedListing } from '@/components/listing/FeaturedListing';
import type { FeaturedItem } from '@/types/listing';

export const metadata: Metadata = {
  title: 'Blog Floring - Kien thuc san go, LVT, SPC',
  description:
    'Cap nhat kien thuc ve san go, LVT va SPC: cach chon vat lieu, thi cong chuan ky thuat va bao duong de san ben dep lau dai.',
};

export default async function BlogIndexPage() {
  const { data: posts } = await getBlogPosts(1, 12).catch(() => ({ data: [] }));
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
