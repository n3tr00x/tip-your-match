import type { RankingStanding } from '@/lib/ranking/types';
import Link from 'next/link';

type ProfileStatsProps = {
	standing: RankingStanding | null;
};

export function ProfileStats({ standing }: ProfileStatsProps) {
	if (!standing) {
		return (
			<p className="border-2 p-4 text-sm text-muted-foreground">
				Nie masz jeszcze rozliczonych typów w tym sezonie.{' '}
				<Link
					href="/predictions"
					className="font-medium text-primary underline-offset-4 hover:underline"
				>
					Typuj mecze
				</Link>
			</p>
		);
	}

	return (
		<div className="space-y-2">
			<dl className="grid grid-cols-2 gap-4">
				<div className="space-y-1 border-2 p-4">
					<dt className="text-xs uppercase tracking-widest text-muted-foreground">
						Miejsce w rankingu
					</dt>
					<dd className="font-heading text-2xl tabular-nums">
						{standing.position}
						<span className="text-sm text-muted-foreground">
							{' '}
							/ {standing.totalPlayers}
						</span>
					</dd>
				</div>
				<div className="space-y-1 border-2 p-4">
					<dt className="text-xs uppercase tracking-widest text-muted-foreground">
						Punkty
					</dt>
					<dd className="font-heading text-2xl tabular-nums">
						{standing.points}
					</dd>
				</div>
			</dl>
			<Link
				href="/predictions"
				className="text-xs text-primary underline-offset-4 hover:underline"
			>
				Zobacz pełny ranking
			</Link>
		</div>
	);
}
