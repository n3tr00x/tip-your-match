import { prisma } from '@/lib/prisma';
import type { UserPrediction } from '@/lib/predictions/rules';

export async function getUserPredictions(
	userId: string,
	fixtureIds: string[],
): Promise<Record<string, UserPrediction>> {
	if (fixtureIds.length === 0) {
		return {};
	}

	const predictions = await prisma.prediction.findMany({
		where: { userId, fixtureId: { in: fixtureIds } },
		select: { fixtureId: true, homeScore: true, awayScore: true, points: true },
	});
	const predictionMap = Object.fromEntries(
		predictions.map(({ fixtureId, ...scores }) => [fixtureId, scores]),
	);

	return predictionMap;
}
