import slugify from 'slugify';

export function toSlug(input: string): string {
    return slugify(input, { lower: true, strict: true, locale: 'vi' });
}


export async function generateUniqueSlug(
    input: string,
    existsBySlug: (slug: string) => Promise<string | null>,
    excludeId?: string,
): Promise<string> {
    const base = toSlug(input);
    if (!base) return crypto.randomUUID();

    let candidate = base;
    let counter = 2;

    while (true) {
        const existingId = await existsBySlug(candidate);
        if (!existingId || (excludeId && existingId === excludeId)) return candidate;

        candidate = `${base}-${counter}`;
        counter += 1;
    }
}

