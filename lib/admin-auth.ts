export const ADMIN_ACCESS_TOKEN_COOKIE = 'jadimulya_admin_access_token';
export const ADMIN_REFRESH_TOKEN_COOKIE = 'jadimulya_admin_refresh_token';
export const ADMIN_CLIENT_ACCESS_TOKEN_COOKIE = 'jadimulya_admin_access_token_client';

// BARU — durasi cookie dipusatkan di sini (bukan angka hardcode di page.tsx)
// supaya sekali ubah, konsisten di semua tempat yang men-set cookie ini.
//
// PENTING: ini cuma mengatur berapa lama BROWSER menyimpan cookie-nya.
// Backend tetap menolak (401) kalau JWT access token itu sendiri sudah
// melewati `exp` yang di-set saat backend men-generate token (biasanya
// `jwt.sign(payload, secret, { expiresIn: '...' })` di auth service).
// Supaya sesi admin benar-benar bertahan 7 hari, expiry JWT access token
// di BACKEND juga harus disamakan jadi 7 hari (atau backend perlu endpoint
// refresh yang dipakai otomatis oleh admin-api-client saat dapat 401).
export const ADMIN_ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 hari
export const ADMIN_REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 hari

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