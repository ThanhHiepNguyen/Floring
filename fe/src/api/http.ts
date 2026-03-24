import axios, { type AxiosError, type AxiosInstance } from 'axios';


const envBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
if (!envBase) {
  throw new Error('Missing NEXT_PUBLIC_API_BASE_URL in frontend environment');
}
let resolvedBase = envBase;

if (!/\/api\/v1\/?$/.test(resolvedBase)) {
  resolvedBase = resolvedBase.replace(/\/+$/, '') + '/api/v1';
}

export const API_BASE_URL: string = resolvedBase;

const AUTH_TOKEN_STORAGE_KEY = 'access_token';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string | null) {
  if (typeof window === 'undefined') return;
  try {
    if (!token) window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    else window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  } catch {

  }
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },

  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (typeof window !== 'undefined' && error.response?.status === 401) {
      const isAdminPath = window.location.pathname.startsWith('/admin');
      const isAdminLoginPath = window.location.pathname.startsWith('/admin/login');
      if (isAdminPath && !isAdminLoginPath) {
        setAccessToken(null);
        window.location.replace('/admin/login?reason=unauthorized');
      }
    }
    return Promise.reject(error);
  },
);

export function toApiErrorMessage(err: unknown): string {
  const e = err as AxiosError<{ message?: string; error?: string } | string>;
  if (axios.isAxiosError(e)) {
    const data = e.response?.data;
    const msgFromBody =
      typeof data === 'string' ? data : data?.message || data?.error;
    return (
      msgFromBody ||
      e.message ||
      `Request failed: ${e.response?.status ?? ''}`.trim()
    );
  }
  return err instanceof Error ? err.message : 'Unknown error';
}

