import type { FixtureUncheckedCreateInput } from '@/app/generated/prisma/models';
import { prisma } from '@/lib/prisma';
import { requireEnvVariable } from '@/lib/utils';
import { fetchSeasonFixtures } from '@/lib/football-api/client';
import { mapMatchToFixtureData } from '@/lib/football-api/mappers';
import { syncPredictionPoints } from '@/lib/predictions/score-fixtures';

type ExistingFixture = Pick<
	FixtureUncheckedCreateInput,
	| 'round'
	| 'kickoff'
	| 'status'
	| 'homeTeam'
	| 'awayTeam'
	| 'homeTeamLogo'
	| 'awayTeamLogo'
	| 'homeScore'
	| 'awayScore'
>;

function hasFixtureChanged(
	existing: ExistingFixture,
	incoming: ExistingFixture,
) {
	return (
		existing.round !== incoming.round ||
		new Date(existing.kickoff).getTime() !==
			new Date(incoming.kickoff).getTime() ||
		existing.status !== incoming.status ||
		existing.homeTeam !== incoming.homeTeam ||
		existing.awayTeam !== incoming.awayTeam ||
		existing.homeTeamLogo !== incoming.homeTeamLogo ||
		existing.awayTeamLogo !== incoming.awayTeamLogo ||
		(existing.homeScore ?? null) !== (incoming.homeScore ?? null) ||
		(existing.awayScore ?? null) !== (incoming.awayScore ?? null)
	);
}

export async function syncFixtures() {
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

	return prisma.$transaction(
		async tx => {
			const season = await tx.season.upsert({
				where: { year },
				create: seasonData,
				update: seasonData,
			});

			const existingFixtures = await tx.fixture.findMany({
				where: { seasonId: season.id },
				select: {
					apiId: true,
					round: true,
					kickoff: true,
					status: true,
					homeTeam: true,
					awayTeam: true,
					homeTeamLogo: true,
					awayTeamLogo: true,
					homeScore: true,
					awayScore: true,
				},
			});
			const existingByApiId = new Map(
				existingFixtures.map(fixture => [fixture.apiId, fixture]),
			);
			const changedFixtures = matches
				.map(match => mapMatchToFixtureData(match, season.id))
				.filter(fixture => {
					const existing = existingByApiId.get(fixture.apiId);
					return !existing || hasFixtureChanged(existing, fixture);
				});

			const changedFixtureIds: string[] = [];

			for (const fixture of changedFixtures) {
				const result = await tx.fixture.upsert({
					where: { apiId: fixture.apiId },
					create: fixture,
					update: fixture,
					select: { id: true },
				});
				changedFixtureIds.push(result.id);
			}

			const pendingFixtures = await tx.fixture.findMany({
				where: {
					seasonId: season.id,
					status: 'FINISHED',
					predictions: { some: { points: null } },
				},
				select: { id: true },
			});

			const fixtureIdsToScore = [
				...new Set([
					...changedFixtureIds,
					...pendingFixtures.map(fixture => fixture.id),
				]),
			];

			const scored = await syncPredictionPoints(tx, fixtureIdsToScore);

			return {
				total: matches.length,
				updated: changedFixtures.length,
				scored,
			};
		},
		{ timeout: 60_000 },
	);
}
