import { connection } from 'next/server';

import type { Metadata } from 'next';

import { getSeasonFixtures } from '@/lib/schedule/queries';
import { groupFixturesByRound, partitionRounds, resolveCurrentRound } from '@/lib/schedule/rounds';
import { requireEnvVariable } from '@/lib/utils';

import { FinishedRounds } from '@/components/schedule/finished-rounds';
import { RoundAccordion } from '@/components/schedule/round-accordion';

export const metadata: Metadata = { title: 'Terminarz' };

export default async function SchedulePage() {
	await connection();

	const season = Number(requireEnvVariable('FOOTBALL_API_SEASON'));
	const { fixtures, currentMatchday } = await getSeasonFixtures(season);
	const rounds = groupFixturesByRound(fixtures);
	const currentRound = resolveCurrentRound(fixtures, currentMatchday);
	const { finishedRounds, activeRounds } = partitionRounds(rounds, currentRound);

	return (
		<div className="mx-auto my-4 max-w-7xl">
			<div className="space-y-4">
				<RoundAccordion rounds={activeRounds} currentRound={currentRound} />
				<FinishedRounds finishedRounds={finishedRounds} />
			</div>
		</div>
	);
}
