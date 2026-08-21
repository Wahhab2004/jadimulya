export const ADMIN_ACCESS_TOKEN_COOKIE = "jadimulya_admin_access_token";
export const ADMIN_REFRESH_TOKEN_COOKIE = "jadimulya_admin_refresh_token";
export const ADMIN_CLIENT_ACCESS_TOKEN_COOKIE =
	"jadimulya_admin_access_token_client";

export const ADMIN_ACCESS_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 hari
export const ADMIN_REFRESH_TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 hari

export function getBackendApiBaseUrl() {
	return (
		process.env.BACKEND_API_BASE_URL ??
		process.env.NEXT_PUBLIC_API_BASE_URL ??
		"http://localhost:4000/api/v1"
	);
}

export function hasAdminAccessToken(value?: string) {
	return typeof value === "string" && value.trim().length > 0;
}
