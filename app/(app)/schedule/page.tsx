import { connection } from 'next/server';
import { FinishedRounds } from '@/components/schedule/finished-rounds';
import { RoundAccordion } from '@/components/schedule/round-accordion';
import { getSeasonFixtures } from '@/lib/schedule/queries';
import {
	getCurrentRound,
	groupFixturesByRound,
	partitionRounds,
} from '@/lib/schedule/rounds';
import { requireEnvVariable } from '@/lib/utils';

export default async function SchedulePage() {
	await connection();

	const season = Number(requireEnvVariable('FOOTBALL_API_SEASON'));
	const fixtures = await getSeasonFixtures(season);
	const rounds = groupFixturesByRound(fixtures);
	const currentRound = getCurrentRound(fixtures);
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
