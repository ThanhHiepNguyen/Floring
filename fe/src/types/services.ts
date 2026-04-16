export type Service = {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
};

export type ServicePageProps = {
    params: Promise<{ slug: string }>;
};

export type ServiceRow = {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    imageUrl?: string | null;
    isActive: boolean;
};

export type ServiceListResponse = {
    data: ServiceRow[];
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
};

