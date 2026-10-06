import type { Fixture } from '@/app/generated/prisma/client';
import { isFixtureOpenForPrediction } from '@/lib/predictions/rules';
import { groupFixturesByRound, type Round } from '@/lib/schedule/rounds';

const DAY_MS = 24 * 60 * 60 * 1000;
// A round usually spans Fri–Mon, so ±3 days from its median kickoff covers it.
const ROUND_WINDOW_MS = 3 * DAY_MS;

export type PredictableFixtures = {
	round: Round | undefined;
	// Open fixtures from other rounds: delayed ones from past rounds and ones
	// brought forward from future rounds.
	rescheduled: Fixture[];
	// Postponed fixtures from past rounds that still wait for a new date.
	awaitingDate: Fixture[];
};

type RoundWindow = { start: number; end: number };

function isPlayable(fixture: Pick<Fixture, 'status'>) {
	return fixture.status !== 'POSTPONED' && fixture.status !== 'CANCELLED';
}

function isAwaitingDate(fixture: Pick<Fixture, 'status'>) {
	return fixture.status === 'POSTPONED';
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
// The window never reaches past halfway to a neighbouring round, so a fixture moved
// into a midweek round counts as rescheduled instead of keeping its round open.
function getRoundWindows(fixtures: Fixture[]) {
	const medians = groupFixturesByRound(fixtures).flatMap(round => {
		const median = getMedianKickoff(round.fixtures);
		return median === undefined ? [] : [{ round: round.round, median }];
	});

	return new Map<number, RoundWindow>(
		medians.map(({ round, median }, index) => {
			const previous = medians[index - 1]?.median;
			const next = medians[index + 1]?.median;

			return [
				round,
				{
					start: Math.max(
						median - ROUND_WINDOW_MS,
						previous === undefined ? -Infinity : (previous + median) / 2,
					),
					end: Math.min(
						median + ROUND_WINDOW_MS,
						next === undefined ? Infinity : (median + next) / 2,
					),
				},
			];
		}),
	);
}

function createOnScheduleCheck(fixtures: Fixture[]) {
	const windows = getRoundWindows(fixtures);

	return (fixture: Fixture) => {
		const window = windows.get(fixture.round);
		const kickoff = fixture.kickoff.getTime();

		return (
			window === undefined || (kickoff >= window.start && kickoff <= window.end)
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
		return {
			round: undefined,
			rescheduled: openFixtures,
			awaitingDate: fixtures.filter(isAwaitingDate),
		};
	}

	const currentRound = Math.min(...onScheduleRounds);
	const nextRoundStart = getNextRoundStart(fixtures, currentRound, isOnSchedule);

	// Delayed fixtures stay open until kickoff, however far the new date is.
	const isDelayed = (fixture: Fixture) => fixture.round < currentRound;
	// Fixtures from later rounds show up once they kick off before the next round starts.
	const isBroughtForward = (fixture: Fixture) =>
		fixture.round > currentRound &&
		(nextRoundStart === undefined ||
			fixture.kickoff.getTime() < nextRoundStart);

	return {
		round: {
			round: currentRound,
			fixtures: fixtures.filter(fixture => fixture.round === currentRound),
		},
		rescheduled: openFixtures.filter(
			fixture => isDelayed(fixture) || isBroughtForward(fixture),
		),
		awaitingDate: fixtures.filter(
			fixture => isDelayed(fixture) && isAwaitingDate(fixture),
		),
	};
}
