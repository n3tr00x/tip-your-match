import { describe, expect, it } from 'vitest';

import { getMatchOutcome } from '@/lib/match-outcome';

describe('getMatchOutcome', () => {
	it.each([
		{ homeScore: 2, awayScore: 1, outcome: 'home' },
		{ homeScore: 0, awayScore: 3, outcome: 'away' },
		{ homeScore: 2, awayScore: 2, outcome: 'draw' },
		{ homeScore: 0, awayScore: 0, outcome: 'draw' },
	])('returns "$outcome" for $homeScore:$awayScore', ({ homeScore, awayScore, outcome }) => {
		expect(getMatchOutcome({ homeScore, awayScore })).toBe(outcome);
	});

	it.each([
		{ homeScore: null, awayScore: null },
		{ homeScore: 1, awayScore: null },
		{ homeScore: null, awayScore: 0 },
	])('returns null for $homeScore:$awayScore', (score) => {
		expect(getMatchOutcome(score)).toBeNull();
	});
});
