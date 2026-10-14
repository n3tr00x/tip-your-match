import 'dotenv/config';

import type { Prisma } from '@/app/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { calculatePoints } from '@/lib/predictions/scoring';
import { requireEnvVariable } from '@/lib/utils';

const SEED_PREFIX = 'seed-';
const USER_COUNT = 45;
const RANDOM_SEED = 2026;
const LOCAL_HOSTS = ['localhost', '127.0.0.1'];

const FIRST_NAMES = [
	'Łukasz',
	'Lucyna',
	'anna',
	'Żaneta',
	'Zbigniew',
	'Ścibor',
	'Agnieszka',
	'Bartosz',
	'Celina',
	'Ćwirek',
	'Ewelina',
	'Grzegorz',
	'Iwona',
	'Józef',
	'Małgorzata',
];
const LAST_NAMES = ['Kowalski', 'Nowak', 'Wiśniewski'];
const GOALS = [0, 0, 1, 1, 1, 2, 2, 3, 4];

type SeedFixture = {
	id: string;
	round: number;
	homeScore: number;
	awayScore: number;
};

function createRandom(seed: number) {
	let state = seed;

	return () => {
		state = (state + 0x6d2b79f5) | 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

type Random = ReturnType<typeof createRandom>;

function pick<T>(items: T[], random: Random) {
	return items[Math.floor(random() * items.length)];
}

function assertLocalDatabase() {
	const { hostname } = new URL(requireEnvVariable('DATABASE_URL'));

	if (!LOCAL_HOSTS.includes(hostname)) {
		throw new Error(`Seed działa tylko na lokalnej bazie (host: ${hostname})`);
	}
}

function buildPredictions(
	userId: string,
	fixtures: SeedFixture[],
	random: Random,
): Prisma.PredictionCreateManyInput[] {
	const participation = 0.3 + random() * 0.7;
	const skill = 0.05 + random() * 0.3;

	const rounds = [...new Set(fixtures.map(fixture => fixture.round))];
	const playedRounds = new Set(rounds.filter(() => random() < participation));

	return fixtures
		.filter(fixture => playedRounds.has(fixture.round) && random() < 0.9)
		.map(fixture => {
			const isExact = random() < skill;
			const prediction = {
				homeScore: isExact ? fixture.homeScore : pick(GOALS, random),
				awayScore: isExact ? fixture.awayScore : pick(GOALS, random),
			};

			return {
				userId,
				fixtureId: fixture.id,
				...prediction,
				points: calculatePoints(prediction, fixture),
			};
		});
}

async function removeSeedUsers() {
	const { count } = await prisma.user.deleteMany({
		where: { id: { startsWith: SEED_PREFIX } },
	});

	return count;
}

async function getFinishedFixtures(seasonYear: number) {
	const fixtures = await prisma.fixture.findMany({
		where: { season: { year: seasonYear }, status: 'FINISHED' },
		select: { id: true, round: true, homeScore: true, awayScore: true },
		orderBy: { kickoff: 'asc' },
	});

	return fixtures.flatMap(({ homeScore, awayScore, ...fixture }) =>
		homeScore === null || awayScore === null
			? []
			: [{ ...fixture, homeScore, awayScore }],
	);
}

async function main() {
	assertLocalDatabase();

	const removed = await removeSeedUsers();
	console.log(`Usunięto ${removed} graczy testowych.`);

	if (process.argv.includes('--clean')) {
		return;
	}

	const seasonYear = Number(requireEnvVariable('FOOTBALL_API_SEASON'));
	const fixtures = await getFinishedFixtures(seasonYear);

	if (fixtures.length === 0) {
		throw new Error(
			'Brak zakończonych meczów. Uruchom najpierw pnpm sync:fixtures.',
		);
	}

	const random = createRandom(RANDOM_SEED);
	const users = Array.from({ length: USER_COUNT }, (_, index) => {
		const id = `${SEED_PREFIX}${String(index + 1).padStart(2, '0')}`;
		const firstName = FIRST_NAMES[index % FIRST_NAMES.length];
		const lastName =
			LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length];

		return {
			id,
			name: `${firstName} ${lastName}`,
			email: `${id}@example.test`,
		};
	});
	const predictions = users.flatMap(user =>
		buildPredictions(user.id, fixtures, random),
	);

	const [original] = users;
	const twin = {
		id: `${SEED_PREFIX}twin`,
		name: 'Bliźniak Remisowy',
		email: `${SEED_PREFIX}twin@example.test`,
	};
	const twinPredictions = predictions
		.filter(prediction => prediction.userId === original.id)
		.map(prediction => ({ ...prediction, userId: twin.id }));

	await prisma.$transaction([
		prisma.user.createMany({ data: [...users, twin] }),
		prisma.prediction.createMany({
			data: [...predictions, ...twinPredictions],
		}),
	]);

	console.log(
		`Dodano ${users.length + 1} graczy i ${predictions.length + twinPredictions.length} typów na ${fixtures.length} zakończonych meczów.`,
	);
}

main()
	.catch(error => {
		console.error('Seed rankingu nie powiódł się:', error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
