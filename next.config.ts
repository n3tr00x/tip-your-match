import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	allowedDevOrigins: ['192.168.18.66'],
	images: {
		remotePatterns: [
			{ protocol: 'https', hostname: 'crests.football-data.org' },
		],
	},
};

export default nextConfig;
