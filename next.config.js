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
	protocol: "http",
	hostname: "localhost",
	port: "4000",
};

try {
	const parsedBackend = new URL(backendOrigin);
	backendImageHost = {
		protocol: parsedBackend.protocol.replace(":", ""),
		hostname: parsedBackend.hostname,
		port: parsedBackend.port,
	};
} catch {
	backendImageHost = {
		protocol: "http",
		hostname: "localhost",
		port: "4000",
	};
}

const nextConfig = {
	reactStrictMode: true,
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: backendImageHost.protocol,
				hostname: backendImageHost.hostname,
				port: backendImageHost.port,
				pathname: "/uploads/**",
			},
			{
				protocol: "https",
				hostname: "api.jadimulya-pangandaran.id",
				pathname: "/**",
			},
		],
	},
	async rewrites() {
		return [
			{
				source: "/uploads/:path*",
				destination: `${backendOrigin}/uploads/:path*`,
			},
		];
	},
};

module.exports = nextConfig;
