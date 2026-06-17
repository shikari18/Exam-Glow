/**
 * api-client.ts
 * Central HTTP client for all ExamGlow API calls to the Django backend.
 * Handles JWT access/refresh tokens stored in localStorage.
 */

export const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

// ─── Token helpers ───────────────────────────────────────────────────────────

export function getAccessToken(): string | null {
  return localStorage.getItem('eg_access');
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('eg_refresh');
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem('eg_access', access);
  localStorage.setItem('eg_refresh', refresh);
}

export function clearTokens(): void {
  localStorage.removeItem('eg_access');
  localStorage.removeItem('eg_refresh');
}

// ─── Core fetch wrapper ──────────────────────────────────────────────────────

let _refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${API_BASE}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      clearTokens();
      return null;
    }
    const data = await res.json();
    localStorage.setItem('eg_access', data.access);
    return data.access;
  } catch {
    clearTokens();
    return null;
  }
}

export type ApiError = {
  status: number;
  message: string;
  detail?: unknown;
};

async function readJsonOrText(res: Response): Promise<unknown> {
  // IMPORTANT: a Response body can only be read once. We read text once and then
  // attempt to JSON-parse it to avoid "body stream already read" errors.
  const raw = await res.text();
  if (!raw) return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };

  const token = getAccessToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  // 401 → try refreshing once
  if (res.status === 401 && retry) {
    if (!_refreshPromise) {
      _refreshPromise = refreshAccessToken().finally(() => {
        _refreshPromise = null;
      });
    }
    const newToken = await _refreshPromise;
    if (newToken) {
      return apiFetch<T>(path, options, false);
    }
    // Refresh failed — clear tokens and let caller handle
    clearTokens();
    window.dispatchEvent(new Event('eg:logout'));
    const err: ApiError = { status: 401, message: 'Session expired. Please log in again.' };
    throw err;
  }

  if (!res.ok) {
    const detail = await readJsonOrText(res);
    const message =
      typeof detail === 'object' && detail !== null
        ? (detail as Record<string, unknown>).detail?.toString() ??
          Object.values(detail as object)[0]?.toString() ??
          `Request failed with status ${res.status}`
        : String(detail) || `Request failed with status ${res.status}`;

    const err: ApiError = { status: res.status, message, detail };
    throw err;
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}

/** Convenience helpers */
export const api = {
  get: <T>(path: string) => apiFetch<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: 'PATCH', body: body !== undefined ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: 'DELETE' }),
};

/**
 * Like api.get but automatically unwraps DRF PageNumberPagination responses.
 * Returns the `results` array when the response has {count, results, next, previous},
 * otherwise returns the response as-is.
 */
export async function apiList<T>(path: string): Promise<T[]> {
  const res = await apiFetch<{ results: T[] } | T[]>(path, { method: 'GET' });
  if (Array.isArray(res)) return res;
  if (res && typeof res === 'object' && 'results' in res) return (res as { results: T[] }).results;
  return res as unknown as T[];
}
