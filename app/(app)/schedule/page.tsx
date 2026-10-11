import { FinishedRounds } from '@/components/schedule/finished-rounds';
import { RoundAccordion } from '@/components/schedule/round-accordion';
import { getSeasonFixtures } from '@/lib/schedule/queries';
import {
	groupFixturesByRound,
	partitionRounds,
	resolveCurrentRound,
} from '@/lib/schedule/rounds';
import { requireEnvVariable } from '@/lib/utils';
import { connection } from 'next/server';

export default async function SchedulePage() {
	await connection();

	const season = Number(requireEnvVariable('FOOTBALL_API_SEASON'));
	const { fixtures, currentMatchday } = await getSeasonFixtures(season);
	const rounds = groupFixturesByRound(fixtures);
	const currentRound = resolveCurrentRound(fixtures, currentMatchday);
	const { finishedRounds, activeRounds } = partitionRounds(
		rounds,
		currentRound,
	);

	return (
		<div className="max-w-7xl mx-auto my-4">
			<div className="space-y-4">
				<RoundAccordion rounds={activeRounds} currentRound={currentRound} />
				<FinishedRounds finishedRounds={finishedRounds} />
			</div>
		</div>
	);
}
