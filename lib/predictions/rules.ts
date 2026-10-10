import type { Fixture, Prediction } from '@/app/generated/prisma/client';

const PREDICTION_LOCK_MINUTES = 5;

export type PredictionScore = Pick<Prediction, 'homeScore' | 'awayScore'>;

export function getPredictionDeadline(kickoff: Date) {
	return new Date(kickoff.getTime() - 60 * PREDICTION_LOCK_MINUTES * 1000);
}

export function isFixtureOpenForPrediction(
	fixture: Pick<Fixture, 'kickoff' | 'status'>,
	now = new Date(),
) {
	const deadline = getPredictionDeadline(fixture.kickoff);
	return fixture.status === 'SCHEDULED' && now < deadline;
}
