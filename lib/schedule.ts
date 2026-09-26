import type { Fixture } from '@/app/generated/prisma/client';
import { prisma } from '@/lib/prisma';

export type Round = {
	round: string;
	fixtures: Fixture[];
};

export type RoundState = 'finished' | 'current' | 'upcoming';

export async function getSeasonFixtures(season: number) {
	const schedule = await prisma.fixture.findMany({
		where: { season },
		orderBy: [{ kickoff: 'asc' }],
	});

	return schedule;
}

export function groupFixturesByRound(fixtures: Fixture[]) {
	const fixturesByRound = new Map<string, Fixture[]>();

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
	})).sort((a, b) => Number(a.round) - Number(b.round));
}

export function getCurrentRound(
	fixtures: Fixture[],
	now = new Date(),
): string | undefined {
	const playable = fixtures.filter(
		fixture => fixture.status !== 'POSTPONED' && fixture.status !== 'CANCELLED',
	);
	const roundNumbers = playable.map(fixture => Number(fixture.round));

	if (roundNumbers.length === 0) {
		return undefined;
	}

	const startedRounds = playable
		.filter(fixture => fixture.kickoff <= now)
		.map(fixture => Number(fixture.round));

	if (startedRounds.length === 0) {
		return String(Math.min(...roundNumbers));
	}

	const lastStartedRound = Math.max(...startedRounds);
	const isLastStartedRoundFinished = playable
		.filter(fixture => Number(fixture.round) === lastStartedRound)
		.every(fixture => fixture.status === 'FINISHED');
	const nextRound = lastStartedRound + 1;

	if (isLastStartedRoundFinished && roundNumbers.includes(nextRound)) {
		return String(nextRound);
	}

	return String(lastStartedRound);
}

export function getRoundState(
	round: string,
	currentRound: string | undefined,
): RoundState {
	if (!currentRound) {
		return 'upcoming';
	}

	const difference = Number(round) - Number(currentRound);

	if (difference < 0) {
		return 'finished';
	}

	if (difference === 0) {
		return 'current';
	}

	return 'upcoming';
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

export function partitionRounds(rounds: Round[], currentRound?: string) {
	const activeRounds = rounds.filter(
		round => getRoundState(round.round, currentRound) !== 'finished',
	);
	const finishedRounds = rounds.filter(
		round => getRoundState(round.round, currentRound) === 'finished',
	);

	return {
		activeRounds,
		finishedRounds,
	};
}
