import type { Fixture, Prediction } from '@/app/generated/prisma/client';
import { getMatchOutcome } from '@/lib/match-outcome';

export const POINTS = { EXACT: 3, OUTCOME: 1, MISS: 0 } as const;

export function calculatePoints(
	prediction: Pick<Prediction, 'homeScore' | 'awayScore'>,
	result: Pick<Fixture, 'homeScore' | 'awayScore'>,
): number | null {
	if (result.homeScore === null || result.awayScore === null) {
		return null;
	}

	if (
		prediction.homeScore === result.homeScore &&
		prediction.awayScore === result.awayScore
	) {
		return POINTS.EXACT;
	}

	if (getMatchOutcome(prediction) === getMatchOutcome(result)) {
		return POINTS.OUTCOME;
	}

	return POINTS.MISS;
}

export function sumScoredPoints(points: (number | null | undefined)[]) {
	const scored = points.filter((value): value is number => value != null);

	if (scored.length === 0) {
		return 0;
	}

	return scored.reduce((sum, value) => sum + value, 0);
}
