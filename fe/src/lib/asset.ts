import { API_BASE_URL } from '@/lib/backend';

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

// Some DB records (or older uploads) may store image paths like "/uploads/<file>".
// Next/Image will request them from the Vercel host and cause 404.
// Normalize those paths to point directly at the backend (Railway) domain.
export function normalizeImageUrl(url?: string | null): string | undefined {
  if (!url) return undefined;

  const trimmed = url.trim();
  if (!trimmed) return undefined;

  if (trimmed.startsWith('/uploads/')) return `${API_ORIGIN}${trimmed}`;
  if (trimmed.startsWith('uploads/')) return `${API_ORIGIN}/${trimmed}`;

  return trimmed;
}

