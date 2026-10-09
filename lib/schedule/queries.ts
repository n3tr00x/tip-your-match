import { prisma } from '@/lib/prisma';

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export async function getSeasonFixtures(seasonYear: number, now = new Date()) {
	const season = await prisma.season.findUnique({
		where: { year: seasonYear },
		include: { fixtures: { orderBy: { kickoff: 'asc' } } },
	});

	if (!season) {
		return { fixtures: [], currentMatchday: undefined };
	}

	const age = now.getTime() - season.updatedAt.getTime();

	return {
		fixtures: season.fixtures,
		currentMatchday: age > MAX_AGE_MS ? undefined : season.currentMatchday,
	};
}
