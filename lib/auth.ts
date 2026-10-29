import { APIError, betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { requireEnvVariable } from '@/lib/utils';
import { profileSchema } from './profile/schema';

const profileUpdateSchema = profileSchema.partial();

export const auth = betterAuth({
	plugins: [nextCookies()],
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	user: { additionalFields: { bio: { type: 'string', required: false } } },
	emailAndPassword: { enabled: true },
	databaseHooks: {
		user: {
			create: {
				before: async user => ({ data: { ...user, bio: null } }),
			},
			update: {
				before: async (user, context) => {
					if (context?.path !== '/update-user') {
						return;
					}

					const parsed = profileUpdateSchema.safeParse(user);

					if (!parsed.success) {
						throw new APIError('BAD_REQUEST', {
							message: parsed.error.issues[0].message,
						});
					}

					return { data: parsed.data };
				},
			},
		},
	},
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
