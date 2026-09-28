import 'server-only';

import { FootballDataMatchesResponse } from '@/lib/football-api/types';
import { requireEnvVariable } from '@/lib/utils';

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

	const response = await fetch(url, {
		headers,
		signal: AbortSignal.timeout(10000),
	});

	if (!response.ok) {
		throw new Error(`Failed to fetch season fixtures: ${response.statusText}`);
	}

	const data = (await response.json()) as FootballDataMatchesResponse;
	return data;
}
