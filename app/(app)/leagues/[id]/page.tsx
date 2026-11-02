import { notFound } from 'next/navigation';

import type { Metadata } from 'next';

import { getCurrentSeasonId, getLeagueForMember } from '@/lib/leagues/queries';
import { getLeagueRanking } from '@/lib/ranking/queries';
import { requireSession } from '@/lib/session';

import { CopyCodeButton } from '@/components/leagues/copy-code-button';
import { LeagueMembers } from '@/components/leagues/league-members';
import { LeaveLeagueDialog } from '@/components/leagues/leave-league-dialog';
import { RankingTable } from '@/components/ranking/ranking-table';

import { Badge } from '@/components/ui/badge';

export async function generateMetadata({ params }: PageProps<'/leagues/[id]'>): Promise<Metadata> {
	const { id } = await params;
	const session = await requireSession();
	const league = await getLeagueForMember(id, session.user.id);

	return { title: league?.name ?? 'Nie znaleziono ligi' };
}

export default async function LeaguePage({ params }: PageProps<'/leagues/[id]'>) {
	const { id } = await params;
	const session = await requireSession();
	const userId = session.user.id;
	const league = await getLeagueForMember(id, userId);

	if (!league) {
		notFound();
	}

	const [ranking, currentSeasonId] = await Promise.all([
		getLeagueRanking(league.id),
		getCurrentSeasonId(),
	]);

	const isArchived = league.seasonId !== currentSeasonId;

	return (
		<div className="mx-auto my-6 max-w-7xl space-y-8">
			<header className="flex flex-wrap items-center justify-between gap-4 border-b pb-2">
				<h1 className="font-heading tracking-widest uppercase">{league.name}</h1>
				{isArchived ? (
					<Badge>Sezon zakończony</Badge>
				) : (
					<div className="flex items-center gap-2">
						<span className="text-xs tracking-widest text-muted-foreground uppercase">Kod</span>
						<code className="font-mono tracking-widest select-all">{league.code}</code>
						<CopyCodeButton code={league.code} />
					</div>
				)}
			</header>

			<section aria-labelledby="league-ranking" className="space-y-4">
				<h2 id="league-ranking" className="font-heading text-sm tracking-widest uppercase">
					Ranking
				</h2>
				<RankingTable data={ranking} currentUserId={userId} />
			</section>

			<LeagueMembers members={league.members} currentUserId={userId} />

			<div className="flex justify-end border-t pt-4">
				<LeaveLeagueDialog leagueId={league.id} leagueName={league.name} isAdmin={league.isAdmin} />
			</div>
		</div>
	);
}
