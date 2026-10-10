import type { Fixture } from '@/app/generated/prisma/client';
import { isFixtureOpenForPrediction } from '@/lib/predictions/rules';
import { groupFixturesByRound, type Round } from '@/lib/schedule/rounds';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const HORIZON_IN_MS = 7 * DAY_IN_MS;
const ROUND_WINDOW_IN_MS = 3 * DAY_IN_MS;

export type PredictableFixtures = {
	round: Round | undefined;
	moved: Fixture[];
	awaitingDate: Fixture[];
};

function isAwaitingDate(fixture: Pick<Fixture, 'status'>) {
	return fixture.status === 'POSTPONED';
}

function isPlayable(fixture: Pick<Fixture, 'status'>) {
	return fixture.status !== 'POSTPONED' && fixture.status !== 'CANCELLED';
}

function getMedianKickoff(fixtures: Fixture[]) {
	const kickoffs = fixtures
		.filter(isPlayable)
		.map(fixture => fixture.kickoff.getTime())
		.sort((a, b) => a - b);

	return kickoffs.length > 0
		? kickoffs[Math.floor(kickoffs.length / 2)]
		: undefined;
}

function createOnScheduleCheck(fixtures: Fixture[]) {
	const medians = new Map(
		groupFixturesByRound(fixtures).map(round => [
			round.round,
			getMedianKickoff(round.fixtures),
		]),
	);

	return (fixture: Fixture) => {
		const median = medians.get(fixture.round);

		return (
			median === undefined ||
			Math.abs(fixture.kickoff.getTime() - median) <= ROUND_WINDOW_IN_MS
		);
	};
}

export function getPredictableFixtures(
	fixtures: Fixture[],
	currentRound: number | undefined,
	now = new Date(),
): PredictableFixtures {
	if (currentRound === undefined) {
		return { round: undefined, moved: [], awaitingDate: [] };
	}

	const horizon = now.getTime() + HORIZON_IN_MS;
	const isOnSchedule = createOnScheduleCheck(fixtures);
	const roundFixtures = fixtures.filter(
		fixture =>
			fixture.round === currentRound &&
			isOnSchedule(fixture) &&
			!isAwaitingDate(fixture),
	);

	return {
		round:
			roundFixtures.length > 0
				? { round: currentRound, fixtures: roundFixtures }
				: undefined,
		moved: fixtures.filter(
			fixture =>
				isFixtureOpenForPrediction(fixture, now) &&
				fixture.kickoff.getTime() <= horizon &&
				(fixture.round < currentRound || !isOnSchedule(fixture)),
		),
		awaitingDate: fixtures.filter(
			fixture => fixture.round <= currentRound && isAwaitingDate(fixture),
		),
	};
}
