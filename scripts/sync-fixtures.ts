import 'dotenv/config';
import { prisma } from '@/lib/prisma';
import { syncFixtures } from '@/lib/football-api/sync-fixtures';

syncFixtures()
	.then(syncedFixtures => {
		console.log(
			`Zsynchronizowano ${syncedFixtures.updated} z ${syncedFixtures.total} meczów.`,
		);
	})
	.catch(error => {
		console.error('Synchronizacja terminarza nie powiodła się:', error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
