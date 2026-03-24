import axios, { type AxiosError, type AxiosInstance } from 'axios';

const envBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
if (!envBase) {
    throw new Error('Missing NEXT_PUBLIC_API_BASE_URL in frontend environment');
}
let resolvedBase = envBase;

// Đảm bảo luôn có hậu tố /api/v1
if (!/\/api\/v1\/?$/.test(resolvedBase)) {
    resolvedBase = resolvedBase.replace(/\/+$/, '') + '/api/v1';
}

export const API_BASE_URL: string = resolvedBase;

export class BackendError extends Error {
    status?: number;
    constructor(message: string, status?: number) {
        super(message);
        this.name = 'BackendError';
        this.status = status;
    }
}

const serverApi: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { Accept: 'application/json' },
});

export async function backendGet<T>(
    path: string,
    options?: {
        searchParams?: Record<string, string | number | boolean | undefined>;
        timeoutMs?: number;
    },
): Promise<T> {
    try {
        const res = await serverApi.get<T>(path, {
            params: options?.searchParams,
            timeout: options?.timeoutMs ?? 4_000,
        });
        return res.data;
    } catch (err) {
        const e = err as AxiosError<{ message?: string } | string>;
        const status = e.response?.status;
        const data = e.response?.data;
        const message =
            (typeof data === 'string' ? data : data?.message) ||
            e.message ||
            'Backend request failed';
        throw new BackendError(message, status);
    }
}

