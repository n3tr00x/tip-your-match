import type { Fixture } from '@/app/generated/prisma/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TeamRow } from '@/components/schedule/team-row';
import { getMatchOutcome, MatchOutcome } from '@/lib/match-outcome';
import { formatMatchDate } from '@/lib/date';
import { STATUS_LABELS } from '@/lib/fixture-status';

type FixtureCardProps = {
	fixture: Fixture;
};

const getTeamVariant = (
	outcome: MatchOutcome | null,
	side: 'home' | 'away',
) => {
	if (outcome === null || outcome === 'draw') {
		return 'default';
	}

	return outcome === side ? 'winner' : 'loser';
};

export function FixtureCard({ fixture }: FixtureCardProps) {
	const { date, time } = formatMatchDate(fixture.kickoff);
	const outcome =
		fixture.status === 'FINISHED' ? getMatchOutcome(fixture) : null;

	return (
		<Card size="sm" className="ring-0 border-2 border-primary/75 shadow">
			<CardHeader className="flex justify-between items-center">
				<CardTitle className="text-muted-foreground tracking-widest text-[0.625rem] uppercase">
					{date} · {time}
				</CardTitle>
				<span className="text-xs text-muted-foreground tracking-widest text-[0.625rem] uppercase">
					{STATUS_LABELS[fixture.status]}
				</span>
			</CardHeader>
			<CardContent>
				<div className="flex flex-col gap-y-4">
					<TeamRow
						name={fixture.homeTeam}
						logo={fixture.homeTeamLogo}
						score={fixture.homeScore}
						variant={getTeamVariant(outcome, 'home')}
					/>
					<TeamRow
						name={fixture.awayTeam}
						logo={fixture.awayTeamLogo}
						score={fixture.awayScore}
						variant={getTeamVariant(outcome, 'away')}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
