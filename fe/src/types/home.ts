export type HomeService = {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
};

export type HomeServiceListResponse = {
    data: HomeService[];
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
};

export type HomeProject = {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    location?: string | null;
    totalAreaM2?: number | null;
    images: { id: string; imageUrl: string }[];
};

export type HomeProjectsResponse = {
    data: HomeProject[];
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
};

export type ProcessStep = {
    step: string;
    title: string;
    desc: string;
};

export type QualityItem = {
    title: string;
    desc: string;
};

export type FAQItem = {
    q: string;
    a: string;
};

export type Testimonial = {
    name: string;
    role: string;
    quote: string;
};

