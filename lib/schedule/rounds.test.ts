import { describe, expect, it } from 'vitest';

import type { FixtureStatus } from '@/app/generated/prisma/enums';

import {
	getCurrentRound,
	getLastCompletedRound,
	getNextFixture,
	getRoundState,
	getRoundSummary,
	groupFixturesByRound,
	isPlayable,
	isRoundCompleted,
	partitionRounds,
	resolveCurrentRound,
	type Round,
} from '@/lib/schedule/rounds';

import { makeFixture } from '@/test/factories';

const now = new Date('2026-03-10T12:00:00Z');
const past = new Date('2026-03-01T15:00:00Z');
const future = new Date('2026-03-20T15:00:00Z');

function makeRound(round: number, statuses: FixtureStatus[]): Round {
	return { round, fixtures: statuses.map((status) => makeFixture({ round, status })) };
}

describe('isPlayable', () => {
	it.each([
		{ status: 'SCHEDULED', expected: true },
		{ status: 'LIVE', expected: true },
		{ status: 'FINISHED', expected: true },
		{ status: 'POSTPONED', expected: false },
		{ status: 'CANCELLED', expected: false },
	] as const)('returns $expected for $status', ({ status, expected }) => {
		expect(isPlayable({ status })).toBe(expected);
	});
});

describe('groupFixturesByRound', () => {
	it('returns an empty list for no fixtures', () => {
		expect(groupFixturesByRound([])).toEqual([]);
	});

	it('groups fixtures by round and sorts rounds ascending', () => {
		const fixtures = [
			makeFixture({ round: 3 }),
			makeFixture({ round: 1 }),
			makeFixture({ round: 3 }),
			makeFixture({ round: 2 }),
		];

		const rounds = groupFixturesByRound(fixtures);

		expect(rounds.map((round) => round.round)).toEqual([1, 2, 3]);
		expect(rounds[2].fixtures).toEqual([fixtures[0], fixtures[2]]);
	});
});

describe('getCurrentRound', () => {
	it('returns undefined when there are no fixtures', () => {
		expect(getCurrentRound([], now)).toBeUndefined();
	});

	it('returns undefined when no fixture is playable', () => {
		const fixtures = [
			makeFixture({ round: 1, status: 'POSTPONED' }),
			makeFixture({ round: 2, status: 'CANCELLED' }),
		];

		expect(getCurrentRound(fixtures, now)).toBeUndefined();
	});

	it('returns the first round before the season starts', () => {
		const fixtures = [
			makeFixture({ round: 3, kickoff: future }),
			makeFixture({ round: 2, kickoff: future }),
		];

		expect(getCurrentRound(fixtures, now)).toBe(2);
	});

	it('stays on the last started round while it is still being played', () => {
		const fixtures = [
			makeFixture({ round: 1, kickoff: past, status: 'FINISHED' }),
			makeFixture({ round: 1, kickoff: past, status: 'LIVE' }),
			makeFixture({ round: 2, kickoff: future }),
		];

		expect(getCurrentRound(fixtures, now)).toBe(1);
	});

	it('moves to the next round once the last started round is finished', () => {
		const fixtures = [
			makeFixture({ round: 1, kickoff: past, status: 'FINISHED' }),
			makeFixture({ round: 1, kickoff: past, status: 'FINISHED' }),
			makeFixture({ round: 2, kickoff: future }),
		];

		expect(getCurrentRound(fixtures, now)).toBe(2);
	});

	it('ignores postponed fixtures when checking if a round is finished', () => {
		const fixtures = [
			makeFixture({ round: 1, kickoff: past, status: 'FINISHED' }),
			makeFixture({ round: 1, kickoff: past, status: 'POSTPONED' }),
			makeFixture({ round: 2, kickoff: future }),
		];

		expect(getCurrentRound(fixtures, now)).toBe(2);
	});

	it('stays on the last round after the season ends', () => {
		const fixtures = [makeFixture({ round: 38, kickoff: past, status: 'FINISHED' })];

		expect(getCurrentRound(fixtures, now)).toBe(38);
	});
});

describe('resolveCurrentRound', () => {
	const fixtures = [
		makeFixture({ round: 1, kickoff: past, status: 'FINISHED' }),
		makeFixture({ round: 2, kickoff: future }),
		makeFixture({ round: 3, kickoff: future }),
	];

	it('trusts the matchday reported by the API when the round exists', () => {
		expect(resolveCurrentRound(fixtures, 3, now)).toBe(3);
	});

	it('falls back to the computed round for an unknown matchday', () => {
		expect(resolveCurrentRound(fixtures, 99, now)).toBe(2);
	});

	it('falls back to the computed round when the API has no matchday', () => {
		expect(resolveCurrentRound(fixtures, undefined, now)).toBe(2);
	});
});

describe('isRoundCompleted', () => {
	it('is true when every fixture is finished', () => {
		expect(isRoundCompleted(makeRound(1, ['FINISHED', 'FINISHED']))).toBe(true);
	});

	it('treats cancelled fixtures as completed', () => {
		expect(isRoundCompleted(makeRound(1, ['FINISHED', 'CANCELLED']))).toBe(true);
	});

	it.each(['SCHEDULED', 'LIVE', 'POSTPONED'] as const)(
		'is false when a fixture is %s',
		(status) => {
			expect(isRoundCompleted(makeRound(1, ['FINISHED', status]))).toBe(false);
		},
	);
});

describe('getRoundState', () => {
	it('treats every round as upcoming when the current round is unknown', () => {
		expect(getRoundState(makeRound(1, ['FINISHED']), undefined)).toBe('upcoming');
	});

	it('returns "upcoming" for a round after the current one', () => {
		expect(getRoundState(makeRound(6, ['SCHEDULED']), 5)).toBe('upcoming');
	});

	it('returns "current" for the current round', () => {
		expect(getRoundState(makeRound(5, ['FINISHED', 'SCHEDULED']), 5)).toBe('current');
	});

	it('returns "finished" for a completed earlier round', () => {
		expect(getRoundState(makeRound(4, ['FINISHED', 'CANCELLED']), 5)).toBe('finished');
	});

	it('returns "pending" for an earlier round with unplayed fixtures', () => {
		expect(getRoundState(makeRound(4, ['FINISHED', 'POSTPONED']), 5)).toBe('pending');
	});
});

describe('getRoundSummary', () => {
	it('summarises kickoffs and finished fixtures of a round', () => {
		const first = new Date('2026-03-14T15:00:00Z');
		const last = new Date('2026-03-16T19:00:00Z');
		const round: Round = {
			round: 5,
			fixtures: [
				makeFixture({ kickoff: first, status: 'FINISHED' }),
				makeFixture({ kickoff: new Date('2026-03-15T15:00:00Z'), status: 'FINISHED' }),
				makeFixture({ kickoff: last, status: 'SCHEDULED' }),
			],
		};

		expect(getRoundSummary(round)).toEqual({
			totalFixtures: 3,
			firstKickoff: first,
			lastKickoff: last,
			finishedCount: 2,
		});
	});
});

describe('partitionRounds', () => {
	it('separates finished rounds from the rest', () => {
		const finished = makeRound(1, ['FINISHED']);
		const pending = makeRound(2, ['FINISHED', 'POSTPONED']);
		const current = makeRound(3, ['SCHEDULED']);
		const upcoming = makeRound(4, ['SCHEDULED']);

		expect(partitionRounds([finished, pending, current, upcoming], 3)).toEqual({
			activeRounds: [pending, current, upcoming],
			finishedRounds: [finished],
		});
	});

	it('keeps every round active when the current round is unknown', () => {
		const rounds = [makeRound(1, ['FINISHED']), makeRound(2, ['SCHEDULED'])];

		expect(partitionRounds(rounds)).toEqual({ activeRounds: rounds, finishedRounds: [] });
	});
});

describe('getNextFixture', () => {
	it('returns the first fixture still open for predictions', () => {
		const finished = makeFixture({ kickoff: past, status: 'FINISHED' });
		const locked = makeFixture({ kickoff: new Date('2026-03-10T12:03:00Z') });
		const open = makeFixture({ kickoff: future });
		const later = makeFixture({ kickoff: new Date('2026-03-21T15:00:00Z') });

		expect(getNextFixture([finished, locked, open, later], now)).toBe(open);
	});

	it('returns undefined when nothing is open', () => {
		const fixtures = [makeFixture({ kickoff: past, status: 'FINISHED' })];

		expect(getNextFixture(fixtures, now)).toBeUndefined();
	});
});

describe('getLastCompletedRound', () => {
	it('returns the latest round where every fixture is done', () => {
		const fixtures = [
			...makeRound(1, ['FINISHED', 'FINISHED']).fixtures,
			...makeRound(2, ['FINISHED', 'CANCELLED']).fixtures,
			...makeRound(3, ['FINISHED', 'SCHEDULED']).fixtures,
		];

		expect(getLastCompletedRound(fixtures)).toBe(2);
	});

	it('skips a round where every fixture was cancelled', () => {
		const fixtures = [
			...makeRound(1, ['FINISHED']).fixtures,
			...makeRound(2, ['CANCELLED', 'CANCELLED']).fixtures,
		];

		expect(getLastCompletedRound(fixtures)).toBe(1);
	});

	it('returns undefined before any round is completed', () => {
		expect(getLastCompletedRound(makeRound(1, ['SCHEDULED']).fixtures)).toBeUndefined();
	});
});
