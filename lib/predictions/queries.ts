import 'server-only';
import { prisma } from '@/lib/prisma';
import { PredictionScore } from './rules';

export async function getUserPredictions(
	userId: string,
	fixtureIds: string[],
): Promise<Record<string, PredictionScore>> {
	if (fixtureIds.length === 0) {
		return {};
	}

	const predictions = await prisma.prediction.findMany({
		where: { userId, fixtureId: { in: fixtureIds } },
		select: { fixtureId: true, homeScore: true, awayScore: true },
	});
	const predictionMap = Object.fromEntries(
		predictions.map(({ fixtureId, ...scores }) => [fixtureId, scores]),
	);

	return predictionMap;
}
