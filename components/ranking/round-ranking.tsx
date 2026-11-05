import { useId } from 'react';

import type { RankingEntry } from '@/lib/ranking/types';

import { RankingTable } from '@/components/ranking/ranking-table';

type RoundRankingProps = {
	round: number | undefined;
	ranking: RankingEntry[];
	currentUserId: string;
};

export function RoundRanking({ round, ranking, currentUserId }: RoundRankingProps) {
	const headingId = useId();
	const currentUser = ranking.find((entry) => entry.userId === currentUserId);

	return (
		<section aria-labelledby={headingId} className="space-y-4">
			<div className="flex items-center justify-between gap-4 border-b pb-2">
				<h2 id={headingId} className="font-heading tracking-widest uppercase tabular-nums">
					{round === undefined ? 'Ostatnia kolejka' : `Kolejka ${round}`}
				</h2>
				{ranking.length > 0 && (
					<span className="text-xs text-muted-foreground tabular-nums">
						{currentUser ? (
							<>
								Twoja pozycja:{' '}
								<span className="font-semibold text-foreground">{currentUser.position}</span> ·{' '}
								{currentUser.points} pkt
							</>
						) : (
							'Brak twoich typów dla ostatniej kolejki'
						)}
					</span>
				)}
			</div>
			{ranking.length === 0 ? (
				<p className="text-muted-foreground">
					{round === undefined
						? 'Ranking pojawi się po zakończeniu pierwszej kolejki'
						: 'Brak rozliczonych typów w tej kolejce'}
				</p>
			) : (
				<RankingTable data={ranking} currentUserId={currentUserId} variant="round" />
			)}
		</section>
	);
}
