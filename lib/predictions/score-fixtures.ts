import type { Prisma } from '@/app/generated/prisma/client';
import { calculatePoints } from '@/lib/predictions/scoring';

export async function syncPredictionPoints(
	tx: Prisma.TransactionClient,
	fixtureIds: string[],
): Promise<number> {
	if (fixtureIds.length === 0) {
		return 0;
	}

	await tx.prediction.updateMany({
		where: {
			fixtureId: { in: fixtureIds },
			fixture: { status: { not: 'FINISHED' } },
			points: { not: null },
		},
		data: { points: null },
	});

	const finishedPredictions = await tx.prediction.findMany({
		where: {
			fixtureId: { in: fixtureIds },
			fixture: { status: 'FINISHED' },
		},
		select: {
			id: true,
			homeScore: true,
			awayScore: true,
			fixture: { select: { homeScore: true, awayScore: true } },
		},
	});

	const idsByPoints = new Map<number, string[]>();

	for (const prediction of finishedPredictions) {
		const points = calculatePoints(prediction, prediction.fixture);

		if (points === null) {
			continue;
		}

		const ids = idsByPoints.get(points) ?? [];
		ids.push(prediction.id);
		idsByPoints.set(points, ids);
	}

	let scored = 0;

	for (const [points, ids] of idsByPoints) {
		const { count } = await tx.prediction.updateMany({
			where: { id: { in: ids } },
			data: { points },
		});

		scored += count;
	}

	return scored;
}
