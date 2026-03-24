export type BlogRow = {
    id: string;
    slug: string;
    title: string;
    excerpt?: string | null;
    content: string;
    imageUrl?: string | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
};

export type AdminBlogStatus = 'loading' | 'idle' | 'saving' | 'error';

export type ContactRow = {
    id: string;
    name: string;
    phone: string;
    email?: string | null;
    message?: string | null;
    status?: string | null;
    createdAt: string;
    service?: { id: string; name: string; slug: string } | null;
    productVariant?: { id: string; name: string; colorCode?: string | null } | null;
    colorOption?: { id: string; name: string; colorCode?: string | null } | null;
};

