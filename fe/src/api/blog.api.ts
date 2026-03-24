import { backendGet } from '@/lib/backend';

export type BlogPost = {
    id: string;
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    imageUrl?: string | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type BlogListResponse = {
    data: BlogPost[];
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
};

export async function getBlogPosts(
    page = 1,
    limit = 10,
): Promise<BlogListResponse> {
    return backendGet<BlogListResponse>('blog/public', {
        searchParams: { page, limit },
    });
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
    return backendGet<BlogPost>(`blog/public/${slug}`);
}

