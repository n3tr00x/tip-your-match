import type { Fixture } from '@/app/generated/prisma/client';

export type Round = {
	round: number;
	fixtures: Fixture[];
};

export type RoundState = 'finished' | 'current' | 'upcoming' | 'pending';

export function groupFixturesByRound(fixtures: Fixture[]) {
	const fixturesByRound = new Map<number, Fixture[]>();

	for (const fixture of fixtures) {
		const roundFixtures = fixturesByRound.get(fixture.round);

		if (roundFixtures) {
			roundFixtures.push(fixture);
		} else {
			fixturesByRound.set(fixture.round, [fixture]);
		}
	}

	return Array.from(fixturesByRound, ([round, fixtures]) => ({
		round,
		fixtures,
	})).sort((a, b) => a.round - b.round);
}

export function getCurrentRound(
	fixtures: Fixture[],
	now = new Date(),
): number | undefined {
	const playable = fixtures.filter(
		fixture => fixture.status !== 'POSTPONED' && fixture.status !== 'CANCELLED',
	);
	const roundNumbers = playable.map(fixture => fixture.round);

	if (roundNumbers.length === 0) {
		return undefined;
	}

	const startedRounds = playable
		.filter(fixture => fixture.kickoff <= now)
		.map(fixture => fixture.round);

	if (startedRounds.length === 0) {
		return Math.min(...roundNumbers);
	}

	const lastStartedRound = Math.max(...startedRounds);
	const isLastStartedRoundFinished = playable
		.filter(fixture => fixture.round === lastStartedRound)
		.every(fixture => fixture.status === 'FINISHED');
	const nextRound = lastStartedRound + 1;

	if (isLastStartedRoundFinished && roundNumbers.includes(nextRound)) {
		return nextRound;
	}

	return lastStartedRound;
}

export function isRoundCompleted(round: Round) {
	return round.fixtures.every(
		fixture => fixture.status === 'FINISHED' || fixture.status === 'CANCELLED',
	);
}

export function getRoundState(
	round: Round,
	currentRound: number | undefined,
): RoundState {
	if (currentRound === undefined) {
		return 'upcoming';
	}

	const difference = round.round - currentRound;

	if (difference > 0) {
		return 'upcoming';
	}

	if (difference === 0) {
		return 'current';
	}

	return isRoundCompleted(round) ? 'finished' : 'pending';
}

export function getRoundSummary(round: Round) {
	const totalFixtures = round.fixtures.length;
	const firstKickoff = round.fixtures[0].kickoff;
	const lastKickoff = round.fixtures[round.fixtures.length - 1].kickoff;
	const finishedCount = round.fixtures.filter(
		fixture => fixture.status === 'FINISHED',
	).length;

	return {
		totalFixtures,
		firstKickoff,
		finishedCount,
		lastKickoff,
	};
}

export function partitionRounds(rounds: Round[], currentRound?: number) {
	const activeRounds = rounds.filter(
		round => getRoundState(round, currentRound) !== 'finished',
	);
	const finishedRounds = rounds.filter(
		round => getRoundState(round, currentRound) === 'finished',
	);

	return {
		activeRounds,
		finishedRounds,
	};
}
