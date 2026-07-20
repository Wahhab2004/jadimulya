import { ADMIN_CLIENT_ACCESS_TOKEN_COOKIE } from '@/lib/admin-auth';

const ADMIN_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export function buildAdminBeUrl(path: string) {
  const baseUrl = ADMIN_API_BASE_URL.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${baseUrl}/${normalizedPath}`;
}

function readCookie(name: string) {
  if (typeof document === 'undefined') {
    return null;
  }

  const needle = `${name}=`;
  const chunks = document.cookie.split(';');

  for (const chunk of chunks) {
    const value = chunk.trim();
    if (value.startsWith(needle)) {
      return decodeURIComponent(value.slice(needle.length));
    }
  }

  return null;
}

export async function adminBeFetch(path: string, options?: RequestInit) {
  const token = readCookie(ADMIN_CLIENT_ACCESS_TOKEN_COOKIE);
  const headers = new Headers(options?.headers);

  if (token && token.trim().length > 0) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return fetch(buildAdminBeUrl(path), {
    ...options,
    headers,
    cache: 'no-store',
    credentials: 'include',
  });
}
