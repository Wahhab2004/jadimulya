const ADMIN_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000/api/v1';

export function buildAdminBeUrl(path: string) {
  const baseUrl = ADMIN_API_BASE_URL.replace(/\/+$/, '');
  const normalizedPath = path.replace(/^\/+/, '');
  return `${baseUrl}/${normalizedPath}`;
}
