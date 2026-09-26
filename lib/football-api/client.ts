import { FixtureStatus } from '@/app/generated/prisma/enums';
import { requireEnvVariable } from '@/lib/utils';
import {
	FootballDataMatch,
	FootballDataMatchesResponse,
	FootballDataMatchStatus,
} from '@/lib/football-api/types';

function mapStatus(status: FootballDataMatchStatus): FixtureStatus {
	switch (status) {
		case 'SCHEDULED':
		case 'TIMED':
			return 'SCHEDULED';
		case 'IN_PLAY':
		case 'PAUSED':
			return 'LIVE';
		case 'FINISHED':
		case 'AWARDED':
			return 'FINISHED';
		case 'POSTPONED':
			return 'POSTPONED';
		case 'SUSPENDED':
		case 'CANCELLED':
			return 'CANCELLED';
	}
}

export function mapMatchToFixtureData(
	match: FootballDataMatch,
	season: number,
) {
	return {
		apiId: match.id,
		season: season,
		round: match.matchday.toString(),
		kickoff: new Date(match.utcDate),
		status: mapStatus(match.status),
		homeTeam: match.homeTeam.name,
		awayTeam: match.awayTeam.name,
		homeTeamLogo: match.homeTeam.crest,
		awayTeamLogo: match.awayTeam.crest,
		homeScore: match.score.fullTime.home,
		awayScore: match.score.fullTime.away,
	};
}

export async function fetchSeasonFixtures(
	season: number,
): Promise<FootballDataMatchesResponse> {
	const FOOTBALL_API_URL = requireEnvVariable('FOOTBALL_API_BASE_URL');
	const FOOTBALL_API_KEY = requireEnvVariable('FOOTBALL_API_KEY');
	const FOOTBALL_API_COMPETITION_ID = requireEnvVariable(
		'FOOTBALL_API_COMPETITION_ID',
	);

	const url = `${FOOTBALL_API_URL}/competitions/${FOOTBALL_API_COMPETITION_ID}/matches?season=${season}`;
	const headers: HeadersInit = {
		'X-Auth-Token': FOOTBALL_API_KEY,
	};

	const response = await fetch(url, { headers });

	if (!response.ok) {
		throw new Error(`Failed to fetch season fixtures: ${response.statusText}`);
	}

	const data = (await response.json()) as FootballDataMatchesResponse;
	return data;
}
