import 'server-only';

import { cache } from 'react';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

// Cached per request so generateMetadata and the page share one session lookup
export const requireSession = cache(async function requireSession() {
	const session = await auth.api.getSession({ headers: await headers() });

	if (!session) {
		redirect('/login');
	}

	return session;
});
