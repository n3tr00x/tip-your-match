import { LEAGUE_LIMITS } from '@/lib/leagues/rules';
import { LeagueSummary } from '@/lib/leagues/types';
import { ChevronRightIcon, UsersIcon } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';

type LeagueCardProps = {
	league: LeagueSummary;
};

export function LeagueCard({ league }: LeagueCardProps) {
	return (
		<Link
			href={`/leagues/${league.id}`}
			className="flex items-center justify-between gap-4 border-2 p-4 transition-colors hover:border-primary/75 focus-visible:border-primary focus-visible:outline-none"
		>
			<div className="space-y-1">
				<p className="font-heading uppercase tracking-widest">{league.name}</p>
				<p className="flex items-center gap-1 text-xs text-muted-foreground tabular-nums">
					<UsersIcon aria-hidden className="size-3" />
					{league.memberCount}/{LEAGUE_LIMITS.MAX_MEMBERS}
					{league.isAdmin && <Badge className="ml-2 text-primary">Admin</Badge>}
				</p>
			</div>
			<ChevronRightIcon aria-hidden className="size-4 text-muted-foreground" />
		</Link>
	);
}
