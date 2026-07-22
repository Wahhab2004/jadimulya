/** @type {import('next').NextConfig} */
const apiBaseUrl =
	process.env.BACKEND_API_BASE_URL ??
	process.env.NEXT_PUBLIC_API_BASE_URL ??
	"http://localhost:4000/api/v1";

let backendOrigin = "http://localhost:4000";
try {
	backendOrigin = new URL(apiBaseUrl).origin;
} catch {
	backendOrigin = "http://localhost:4000";
}

let backendImageHost = {
	protocol: 'http',
	hostname: 'localhost',
	port: '4000',
};

try {
	const parsedBackend = new URL(backendOrigin);
	backendImageHost = {
		protocol: parsedBackend.protocol.replace(':', ''),
		hostname: parsedBackend.hostname,
		port: parsedBackend.port,
	};
} catch {
	backendImageHost = {
		protocol: 'http',
		hostname: 'localhost',
		port: '4000',
	};
}

const nextConfig = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: backendImageHost.protocol,
				hostname: backendImageHost.hostname,
				port: backendImageHost.port,
				pathname: '/uploads/**',
			},
			{
				protocol: 'http',
				hostname: 'localhost',
				port: '3000',
				pathname: '/uploads/**',
			},
		],
	},
	async rewrites() {
		return [
			{
				source: "/uploads/:path*",
				destination: `${backendOrigin}/uploads/:path*`,
			},

			{
				source: "/uploads/:path*",
				destination: `http://localhost:3000/uploads/:path*`,
			},
		];
	},
};

module.exports = nextConfig;
