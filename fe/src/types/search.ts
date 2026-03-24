import type { Service } from '@/types/services';

export type SearchPageProps = {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export type SearchResponse = {
    data: Service[];
    totalItems: number;
    totalPages: number;
    page: number;
    limit: number;
};

