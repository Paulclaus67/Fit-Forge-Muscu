// src/api/client.ts
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000';

export interface ApiError {
  error: string;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const contentType = res.headers.get('content-type');
  const isJson = contentType && contentType.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    const message = data?.error || res.statusText || 'Erreur API';
    throw new Error(message);
  }

  return data as T;
}

export const api = {
  get: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: 'GET' }, token),

  post: <T>(path: string, body?: any, token?: string | null) =>
    request<T>(
      path,
      {
        method: 'POST',
        body: body ? JSON.stringify(body) : undefined,
      },
      token
    ),

  put: <T>(path: string, body?: any, token?: string | null) =>
    request<T>(
      path,
      {
        method: 'PUT',
        body: body ? JSON.stringify(body) : undefined,
      },
      token
    ),
  delete: <T>(path: string, token?: string | null) =>
    request<T>(path, { method: 'DELETE' }, token),
};


