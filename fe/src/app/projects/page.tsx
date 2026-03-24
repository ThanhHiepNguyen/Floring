import type { Metadata } from 'next';
import { backendGet } from '@/lib/backend';
import { FeaturedListing } from '@/components/listing/FeaturedListing';
import type { FeaturedItem } from '@/types/listing';
import type { Project, ProjectsResponse } from '@/types/projects';

export const metadata: Metadata = {
  title: 'Du an thi cong - Floring',
  description:
    'Xem cac du an Floring da thuc hien: can ho, showroom, van phong va nhieu khong gian duoc hoan thien voi san go, LVT va SPC.',
};

export default async function ProjectsPage() {
  const res = await backendGet<ProjectsResponse>('/project', {
    searchParams: { page: 1, limit: 12 },
  }).catch(() => null);

  const projects = res?.data ?? [];
  const featuredProject = projects[0];
  const sideProjects = projects.slice(1, 6);
  const recentProjects = projects.slice(0, 9);

  const toItem = (p: Project): FeaturedItem => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    imageUrl: p.images?.[0]?.imageUrl,
    excerpt: p.description ?? undefined,
  });

  const featured = featuredProject ? toItem(featuredProject) : undefined;
  const curated = sideProjects.map(toItem);
  const recent = recentProjects.map(toItem);

  return (
    <FeaturedListing
      heading="Projects"
      featured={featured}
      curated={curated}
      recent={recent}
      basePath="/projects"
      recentHeading="Dự án gần đây"
      curatedHeading="Các dự án nổi bật khác"
      allLinkLabel="Xem tất cả dự án"
    />
  );
}
