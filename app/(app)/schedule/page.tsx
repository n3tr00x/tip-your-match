import { FinishedRounds } from '@/components/schedule/finished-rounds';
import { RoundAccordion } from '@/components/schedule/round-accordion';
import {
	getCurrentRound,
	getSeasonFixtures,
	groupFixturesByRound,
	partitionRounds,
} from '@/lib/schedule';

export default async function SchedulePage() {
	const fixtures = await getSeasonFixtures(2026);
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
