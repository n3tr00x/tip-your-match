import type { Fixture } from '@/app/generated/prisma/client';
import { isFixtureOpenForPrediction } from '@/lib/predictions/rules';
import type { Round } from '@/lib/schedule/rounds';

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const HORIZON_IN_MS = 7 * DAY_IN_MS;

export type PredictableFixtures = {
	round: Round | undefined;
	delayed: Fixture[];
	broughtForward: Fixture[];
	awaitingDate: Fixture[];
};

function isAwaitingDate(fixture: Fixture) {
	return fixture.status === 'POSTPONED';
}

export function getPredictableFixtures(
	fixtures: Fixture[],
	currentRound: number | undefined,
	now = new Date(),
) {
	const horizon = now.getTime() + HORIZON_IN_MS;
	const isOpenForPrediction = (fixture: Fixture) =>
		isFixtureOpenForPrediction(fixture, now);
	const isWithinHorizon = (fixture: Fixture) =>
		fixture.kickoff.getTime() <= horizon;

	if (currentRound === undefined) {
		return {
			round: undefined,
			delayed: [],
			broughtForward: fixtures.filter(
				fixture => isOpenForPrediction(fixture) && isWithinHorizon(fixture),
			),
			awaitingDate: [],
		};
	}

	const roundFixtures = fixtures.filter(
		fixture => fixture.round === currentRound && !isAwaitingDate(fixture),
	);

	return {
		round:
			roundFixtures.length > 0
				? { round: currentRound, fixtures: roundFixtures }
				: undefined,
		delayed: fixtures.filter(
			fixture => fixture.round < currentRound && isOpenForPrediction(fixture),
		),
		broughtForward: fixtures.filter(
			fixture =>
				fixture.round > currentRound &&
				isOpenForPrediction(fixture) &&
				isWithinHorizon(fixture),
		),
		awaitingDate: fixtures.filter(
			fixture => fixture.round <= currentRound && isAwaitingDate(fixture),
		),
	};
}
