export type BlogPostPageProps = {
    params: Promise<{ slug: string }>;
};

export type TocItem = {
    id: string;
    label: string;
    level: 1 | 2 | 3;
};

