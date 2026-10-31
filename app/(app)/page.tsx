import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthRedirectToast } from '@/components/auth/auth-redirect-toast';
import { requireSession } from '@/lib/session';
import { requireEnvVariable } from '@/lib/utils';
import { getUserStanding } from '@/lib/ranking/queries';
import { StandingStats } from '@/components/ranking/standing-stats';
import { NextFixture } from '@/components/dashboard/next-fixture';
import { getSeasonFixtures } from '@/lib/schedule/queries';
import { getNextFixture } from '@/lib/schedule/rounds';

export const metadata: Metadata = { title: 'Panel' };

export default async function Home() {
	const session = await requireSession();
	const now = new Date();
	const seasonYear = Number(requireEnvVariable('FOOTBALL_API_SEASON'));

	const standing = await getUserStanding(session.user.id, seasonYear);
	const { fixtures } = await getSeasonFixtures(seasonYear, now);
	const nextFixture = getNextFixture(fixtures, now);

	return (
		<div className="max-w-7xl mx-auto my-6 space-y-6">
			<Suspense>
				<AuthRedirectToast />
			</Suspense>
			<header className="border-b pb-2">
				<h1 className="font-heading uppercase tracking-widest">Panel</h1>
			</header>
			<div className="grid grid-cols-1 gap-6">
				<StandingStats standing={standing} />
				<NextFixture fixture={nextFixture} />
			</div>
		</div>
	);
}
