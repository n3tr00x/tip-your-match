import { LEAGUE_LIMITS } from '@/lib/leagues/rules';
import { LeagueMemberEntry } from '@/lib/leagues/types';
import { cn } from 'cn';
import { Badge } from '../ui/badge';

type LeagueMembersProps = {
	members: LeagueMemberEntry[];
	currentUserId: string;
};

export function LeagueMembers({ members, currentUserId }: LeagueMembersProps) {
	return (
		<section aria-labelledby="league-members" className="space-y-4">
			<h2
				id="league-members"
				className="font-heading uppercase tracking-widest text-sm"
			>
				Członkowie{' '}
				<span className="text-muted-foreground tabular-nums">
					({members.length}/{LEAGUE_LIMITS.MAX_MEMBERS})
				</span>
			</h2>
			<ul className="divide-y border-2">
				{members.map(member => {
					const isCurrentUser = member.userId === currentUserId;

					return (
						<li
							key={member.userId}
							className={cn(
								'flex items-center justify-between gap-4 p-3',
								isCurrentUser && 'bg-muted/50',
							)}
						>
							<span className="flex items-center gap-2">
								{member.name}
								{isCurrentUser && (
									<span className="text-xs text-muted-foreground">(Ty)</span>
								)}
								{member.isAdmin && (
									<Badge className="text-primary">Admin</Badge>
								)}
							</span>
							<span className="text-xs text-muted-foreground tabular-nums">
								{member.joinedRound}
							</span>
						</li>
					);
				})}
			</ul>
		</section>
	);
}
