import type { Metadata } from 'next';
import { Suspense } from 'react';
import { AuthRedirectToast } from '@/components/auth/auth-redirect-toast';
import { requireSession } from '@/lib/session';
import { requireEnvVariable } from '@/lib/utils';
import { getRanking, getUserStanding } from '@/lib/ranking/queries';
import { StandingStats } from '@/components/ranking/standing-stats';
import { NextFixture } from '@/components/dashboard/next-fixture';
import { getSeasonFixtures } from '@/lib/schedule/queries';
import { getLastCompletedRound, getNextFixture } from '@/lib/schedule/rounds';
import { RoundRanking } from '@/components/ranking/round-ranking';

export const metadata: Metadata = { title: 'Panel' };

export default async function Home() {
	const session = await requireSession();
	const now = new Date();
	const seasonYear = Number(requireEnvVariable('FOOTBALL_API_SEASON'));

	const [standing, { fixtures }] = await Promise.all([
		getUserStanding(session.user.id, seasonYear),
		getSeasonFixtures(seasonYear, now),
	]);
	const nextFixture = getNextFixture(fixtures, now);
	const lastRound = getLastCompletedRound(fixtures);
	const roundRanking =
		lastRound === undefined ? [] : await getRanking(seasonYear, lastRound);

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
				<RoundRanking
					round={lastRound}
					ranking={roundRanking}
					currentUserId={session.user.id}
				/>
			</div>
		</div>
	);
}
