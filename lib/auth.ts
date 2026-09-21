import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { requireEnvVariable } from '@/lib/utils';

export const auth = betterAuth({
	plugins: [nextCookies()],
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	emailAndPassword: { enabled: true },
	socialProviders: {
		discord: {
			clientId: requireEnvVariable('DISCORD_CLIENT_ID'),
			clientSecret: requireEnvVariable('DISCORD_CLIENT_SECRET'),
		},
		google: {
			clientId: requireEnvVariable('GOOGLE_CLIENT_ID'),
			clientSecret: requireEnvVariable('GOOGLE_CLIENT_SECRET'),
		},
	},
});
