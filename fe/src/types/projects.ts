export type ProjectImage = { id: string; imageUrl: string };

export type Project = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  location?: string | null;
  totalAreaM2?: number | null;
  createdAt: string;
  images: ProjectImage[];
};

export type ProjectsResponse = {
  data: Project[];
  totalItems: number;
  totalPages: number;
  page: number;
  limit: number;
};

export type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

