import { CreateLeagueForm } from '@/components/leagues/create-league-form';
import { JoinLeagueForm } from '@/components/leagues/join-league-form';
import { LeagueCard } from '@/components/leagues/league-card';
import {
	countCreatedLeagues,
	getCurrentSeasonId,
	getUserLeagues,
} from '@/lib/leagues/queries';
import { requireSession } from '@/lib/session';

export default async function LeaguesPage() {
	const session = await requireSession();
	const userId = session.user.id;
	const seasonId = await getCurrentSeasonId();

	console.log({ userId, seasonId });

	if (!seasonId) {
		return (
			<p className="max-w-7xl mx-auto my-6 text-muted-foreground">
				Sezon nie jest jeszcze dostępny
			</p>
		);
	}

	const [userLeagues, createdLeaguesCount] = await Promise.all([
		getUserLeagues(userId, seasonId),
		countCreatedLeagues(userId, seasonId),
	]);

	console.log({ userLeagues, createdLeaguesCount });

	return (
		<div className="max-w-7xl mx-auto my-6 space-y-8">
			<header className="border-b pb-2">
				<h1 className="font-heading uppercase tracking-widest">Ligi</h1>
			</header>

			<section aria-labelledby="my-leagues" className="space-y-4">
				<h2
					id="my-leagues"
					className="font-heading uppercase tracking-widest text-sm"
				>
					Moje ligi ({createdLeaguesCount})
				</h2>
				{userLeagues.length === 0 ? (
					<p className="text-muted-foreground">
						Nie należysz do żadnej ligi. Utwórz własną albo dołącz kodem.
					</p>
				) : (
					<ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{userLeagues.map(league => (
							<li key={league.id}>
								<LeagueCard league={league} />
							</li>
						))}
					</ul>
				)}
			</section>

			<div className="grid gap-4 md:grid-cols-2">
				<CreateLeagueForm createdCount={createdLeaguesCount} />
				<JoinLeagueForm />
			</div>
		</div>
	);
}
