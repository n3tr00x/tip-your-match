import type { Fixture } from '@/app/generated/prisma/client';
import { isFixtureOpenForPrediction } from '@/lib/predictions/rules';
import { groupFixturesByRound, type Round } from '@/lib/schedule/rounds';

const DAY_MS = 24 * 60 * 60 * 1000;
// A round usually spans Fri–Mon, so ±3 days from its median kickoff covers it.
const ROUND_WINDOW_MS = 3 * DAY_MS;

export type PredictableFixtures = {
	round: Round | undefined;
	rescheduled: Fixture[];
};

function isPlayable(fixture: Pick<Fixture, 'status'>) {
	return fixture.status !== 'POSTPONED' && fixture.status !== 'CANCELLED';
}

function getMedianKickoff(fixtures: Fixture[]) {
	const kickoffs = fixtures
		.filter(isPlayable)
		.map(fixture => fixture.kickoff.getTime())
		.sort((a, b) => a - b);

	if (kickoffs.length === 0) {
		return undefined;
	}

	return kickoffs[Math.floor(kickoffs.length / 2)];
}

// Median ignores single moved fixtures, so it marks when the round is "really" played.
function createOnScheduleCheck(fixtures: Fixture[]) {
	const medianByRound = new Map(
		groupFixturesByRound(fixtures).map(round => [
			round.round,
			getMedianKickoff(round.fixtures),
		]),
	);

	return (fixture: Fixture) => {
		const median = medianByRound.get(fixture.round);

		return (
			median === undefined ||
			Math.abs(fixture.kickoff.getTime() - median) <= ROUND_WINDOW_MS
		);
	};
}

function getNextRoundStart(
	fixtures: Fixture[],
	currentRound: number,
	isOnSchedule: (fixture: Fixture) => boolean,
) {
	const kickoffs = fixtures
		.filter(
			fixture =>
				fixture.round > currentRound &&
				isPlayable(fixture) &&
				isOnSchedule(fixture),
		)
		.map(fixture => fixture.kickoff.getTime());

	return kickoffs.length > 0 ? Math.min(...kickoffs) : undefined;
}

export function getPredictableFixtures(
	fixtures: Fixture[],
	now = new Date(),
): PredictableFixtures {
	const isOnSchedule = createOnScheduleCheck(fixtures);
	const openFixtures = fixtures.filter(fixture =>
		isFixtureOpenForPrediction(fixture, now),
	);
	const onScheduleRounds = openFixtures
		.filter(isOnSchedule)
		.map(fixture => fixture.round);

	if (onScheduleRounds.length === 0) {
		return { round: undefined, rescheduled: openFixtures };
	}

	const currentRound = Math.min(...onScheduleRounds);
	const nextRoundStart = getNextRoundStart(fixtures, currentRound, isOnSchedule);

	return {
		round: {
			round: currentRound,
			fixtures: fixtures.filter(fixture => fixture.round === currentRound),
		},
		rescheduled: openFixtures.filter(
			fixture =>
				fixture.round !== currentRound &&
				!isOnSchedule(fixture) &&
				(nextRoundStart === undefined ||
					fixture.kickoff.getTime() < nextRoundStart),
		),
	};
}
