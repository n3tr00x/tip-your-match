import { describe, expect, it } from 'vitest';

import { calculatePoints, POINTS, sumScoredPoints } from '@/lib/predictions/scoring';

// Generic so predictions stay `number` while results may contain `null`
const score = <T extends number | null>(homeScore: T, awayScore: T) => ({ homeScore, awayScore });

describe('calculatePoints', () => {
	it.each([
		{ case: 'exact home win', prediction: score(2, 1), result: score(2, 1) },
		{ case: 'exact away win', prediction: score(1, 2), result: score(1, 2) },
		{ case: 'exact draw', prediction: score(1, 1), result: score(1, 1) },
		{ case: 'exact goalless draw', prediction: score(0, 0), result: score(0, 0) },
	])('awards exact points for an $case', ({ prediction, result }) => {
		expect(calculatePoints(prediction, result)).toBe(POINTS.EXACT);
	});

	it.each([
		{ case: 'home win', prediction: score(2, 0), result: score(3, 1) },
		{ case: 'away win', prediction: score(0, 1), result: score(2, 4) },
		{ case: 'draw', prediction: score(1, 1), result: score(2, 2) },
	])('awards outcome points for a correct $case with a wrong score', ({ prediction, result }) => {
		expect(calculatePoints(prediction, result)).toBe(POINTS.OUTCOME);
	});

	it.each([
		{ case: 'home win predicted, away win played', prediction: score(2, 1), result: score(1, 2) },
		{ case: 'draw predicted, home win played', prediction: score(1, 1), result: score(1, 0) },
		{ case: 'away win predicted, draw played', prediction: score(0, 1), result: score(0, 0) },
	])('awards no points when $case', ({ prediction, result }) => {
		expect(calculatePoints(prediction, result)).toBe(POINTS.MISS);
	});

	it.each([score(null, null), score(1, null), score(null, 0)])(
		'returns null when the result is incomplete (%o)',
		(result) => {
			expect(calculatePoints(score(1, 0), result)).toBeNull();
		},
	);
});

describe('sumScoredPoints', () => {
	it('returns null when there are no points', () => {
		expect(sumScoredPoints([])).toBeNull();
	});

	it('returns null when nothing has been scored yet', () => {
		expect(sumScoredPoints([null, undefined, null])).toBeNull();
	});

	it('sums scored points and skips unscored ones', () => {
		expect(sumScoredPoints([3, null, 1, undefined, 0])).toBe(4);
	});

	it('returns zero, not null, when every scored prediction missed', () => {
		expect(sumScoredPoints([0, 0, null])).toBe(0);
	});
});
