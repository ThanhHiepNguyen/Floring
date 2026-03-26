import { API_BASE_URL } from '@/lib/backend';

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

export function normalizeImageUrl(url?: string | null): string {
  if (!url) return '';

  const trimmed = url.trim();
  if (!trimmed) return '';

  if (trimmed.startsWith('/uploads/')) return `${API_ORIGIN}${trimmed}`;
  if (trimmed.startsWith('uploads/')) return `${API_ORIGIN}/${trimmed}`;

  return trimmed;
}

