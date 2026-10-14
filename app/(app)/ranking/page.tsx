import { getRanking } from '@/lib/ranking/queries';
import { requireEnvVariable } from '@/lib/utils';

export default async function RankingPage() {
	const seasonYear = Number(requireEnvVariable('FOOTBALL_API_SEASON'));
	const ranking = await getRanking(seasonYear);

	return <pre>{JSON.stringify(ranking, null, 2)}</pre>;
}
