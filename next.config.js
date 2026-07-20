/** @type {import('next').NextConfig} */
const apiBaseUrl =
  process.env.BACKEND_API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  'http://localhost:4000/api/v1';

let backendOrigin = 'http://localhost:4000';
try {
  backendOrigin = new URL(apiBaseUrl).origin;
} catch {
  backendOrigin = 'http://localhost:4000';
}

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${backendOrigin}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
