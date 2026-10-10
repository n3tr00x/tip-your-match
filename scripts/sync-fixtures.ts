import 'dotenv/config';

import { fetchSeasonFixtures } from '@/lib/football-api/client';
import { mapMatchToFixtureData } from '@/lib/football-api/mappers';
import { prisma } from '@/lib/prisma';
import { requireEnvVariable } from '@/lib/utils';

async function syncFixtures() {
	const year = Number(requireEnvVariable('FOOTBALL_API_SEASON'));
	const { matches } = await fetchSeasonFixtures(year);

	const apiSeason = matches[0]?.season;

	if (!apiSeason) {
		throw new Error('No matches returned for season ' + year);
	}

	const seasonData = {
		apiId: apiSeason.id,
		year,
		startDate: new Date(apiSeason.startDate),
		endDate: new Date(apiSeason.endDate),
		currentMatchday: apiSeason.currentMatchday,
	};

	const syncedFixtures = await prisma.$transaction(
		async tx => {
			const season = await tx.season.upsert({
				where: { year },
				create: seasonData,
				update: seasonData,
			});

			const mappedFixtures = matches.map(match =>
				mapMatchToFixtureData(match, season.id),
			);

			for (const fixture of mappedFixtures) {
				await tx.fixture.upsert({
					where: { apiId: fixture.apiId },
					create: fixture,
					update: fixture,
				});
			}

			return mappedFixtures;
		},
		{ timeout: 60_000 },
	);

	console.log(`Zsynchronizowano ${syncedFixtures.length} meczów.`);
}

syncFixtures()
	.catch(error => {
		console.error('Synchronizacja terminarza nie powiodła się:', error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
