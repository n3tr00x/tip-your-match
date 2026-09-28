import 'server-only';
import { prisma } from '@/lib/prisma';

export async function getSeasonFixtures(season: number) {
	const schedule = await prisma.fixture.findMany({
		where: { season },
		orderBy: [{ kickoff: 'asc' }],
	});

	return schedule;
}
