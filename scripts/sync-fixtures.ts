import 'dotenv/config';

import {
	fetchSeasonFixtures,
	mapMatchToFixtureData,
} from '@/lib/football-api/client';
import { prisma } from '@/lib/prisma';

async function syncFixtures() {
	const fixtures = await fetchSeasonFixtures(2026);
	const mappedFixtures = fixtures.matches.map(match =>
		mapMatchToFixtureData(match, 2026),
	);

	for (const fixture of mappedFixtures) {
		await prisma.fixture.upsert({
			where: { apiId: fixture.apiId },
			create: fixture,
			update: fixture,
		});
	}

	console.log(`Zsynchronizowano ${mappedFixtures.length} meczów.`);
}

syncFixtures()
	.catch(error => {
		console.error('Synchronizacja terminarza nie powiodła się:', error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
