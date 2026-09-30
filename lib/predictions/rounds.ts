import type { Fixture } from '@/app/generated/prisma/client';
import { isFixtureOpenForPrediction } from '@/lib/predictions/rules';
import type { Round } from '@/lib/schedule/rounds';

export type PredictableFixtures = {
	round: Round | undefined;
	overdue: Fixture[];
};

function isPlayable(fixture: Fixture) {
	return fixture.status !== 'POSTPONED' && fixture.status !== 'CANCELLED';
}

// Fixture is overdue when any later round kicks off before it (e.g. rescheduled match).
function isOverdue(fixture: Fixture, fixtures: Fixture[]) {
	return fixtures.some(
		other =>
			other.round > fixture.round &&
			isPlayable(other) &&
			other.kickoff < fixture.kickoff,
	);
}

export function getPredictableFixtures(
	fixtures: Fixture[],
	now = new Date(),
): PredictableFixtures {
	const openFixtures = fixtures.filter(fixture =>
		isFixtureOpenForPrediction(fixture, now),
	);
	const overdueFixtures = openFixtures.filter(fixture =>
		isOverdue(fixture, fixtures),
	);
	const regularRounds = openFixtures
		.filter(fixture => !overdueFixtures.includes(fixture))
		.map(fixture => fixture.round);

	if (regularRounds.length === 0) {
		return { round: undefined, overdue: overdueFixtures };
	}

	const roundNumber = Math.min(...regularRounds);

	return {
		round: {
			round: roundNumber,
			fixtures: fixtures.filter(fixture => fixture.round === roundNumber),
		},
		overdue: overdueFixtures.filter(fixture => fixture.round !== roundNumber),
	};
}
