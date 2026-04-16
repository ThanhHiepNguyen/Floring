import type { Metadata } from 'next';
import { backendGet } from '@/lib/backend';
import { FeaturedListing } from '@/components/listing/FeaturedListing';
import type { FeaturedItem } from '@/types/listing';
import type { Project, ProjectsResponse } from '@/types/projects';

export const metadata: Metadata = {
  title: 'Installation Projects - Floring',
  description:
    'Explore completed Floring projects: apartments, showrooms, offices, and many spaces finished with timber, LVT, and SPC flooring.',
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
      recentHeading="Recent projects"
      curatedHeading="Other featured projects"
      allLinkLabel="View all projects"
    />
  );
}
