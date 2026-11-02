import type { Metadata } from 'next';

import { getRanking } from '@/lib/ranking/queries';
import { requireSession } from '@/lib/session';
import { requireEnvVariable } from '@/lib/utils';

import { RankingTable } from '@/components/ranking/ranking-table';

const formatSeason = (year: number) => `${year}/${year + 1}`;

export const metadata: Metadata = { title: 'Ranking' };

export default async function RankingPage() {
	const session = await requireSession();
	const seasonYear = Number(requireEnvVariable('FOOTBALL_API_SEASON'));
	const ranking = await getRanking(seasonYear);

	return (
		<div className="mx-auto my-6 max-w-7xl space-y-6">
			<header className="flex items-center justify-between gap-4 border-b pb-2">
				<h1 className="font-heading tracking-widest uppercase">
					Ranking {formatSeason(seasonYear)}
				</h1>
			</header>

			{ranking.length === 0 ? (
				<p className="text-muted-foreground">Ranking pojawi się po rozliczeniu pierwszych meczów</p>
			) : (
				<RankingTable data={ranking} currentUserId={session.user.id} />
			)}
		</div>
	);
}
