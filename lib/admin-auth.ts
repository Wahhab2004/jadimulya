export const ADMIN_ACCESS_TOKEN_COOKIE = 'jadimulya_admin_access_token';
export const ADMIN_REFRESH_TOKEN_COOKIE = 'jadimulya_admin_refresh_token';

export function getBackendApiBaseUrl() {
  return (
    process.env.BACKEND_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    'http://localhost:3000/api/v1'
  );
}

export function hasAdminAccessToken(value?: string) {
  return typeof value === 'string' && value.trim().length > 0;
}