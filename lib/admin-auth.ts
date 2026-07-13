export const ADMIN_AUTH_COOKIE = 'jadimulya_admin_session';

const defaultUsername = 'admin';
const defaultPassword = 'jadimulya2024';

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? defaultUsername,
    password: process.env.ADMIN_PASSWORD ?? defaultPassword,
  };
}

export function createAdminSessionValue() {
  const { username } = getAdminCredentials();
  return `authenticated:${username}`;
}

export function verifyAdminLogin(username: string, password: string) {
  const credentials = getAdminCredentials();

  return username === credentials.username && password === credentials.password;
}

export function isValidAdminSession(value?: string) {
  return value === createAdminSessionValue();
}