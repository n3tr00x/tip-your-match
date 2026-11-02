import type { Fixture } from '@/app/generated/prisma/client';

import { formatMatchDate } from '@/lib/date';
import { STATUS_LABELS } from '@/lib/fixture-status';
import { getMatchOutcome, MatchOutcome } from '@/lib/match-outcome';

import { TeamRow } from '@/components/schedule/team-row';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type FixtureCardProps = {
	fixture: Fixture;
};

const getTeamVariant = (outcome: MatchOutcome | null, side: 'home' | 'away') => {
	if (outcome === null || outcome === 'draw') {
		return 'default';
	}

	return outcome === side ? 'winner' : 'loser';
};

export function FixtureCard({ fixture }: FixtureCardProps) {
	const { date, time } = formatMatchDate(fixture.kickoff);
	const outcome = fixture.status === 'FINISHED' ? getMatchOutcome(fixture) : null;

	return (
		<Card size="sm" className="border-2 border-primary/75 shadow ring-0">
			<CardHeader className="flex items-center justify-between">
				<CardTitle className="text-[0.625rem] tracking-widest text-muted-foreground uppercase">
					{date} · {time}
				</CardTitle>
				<span className="text-xs text-[0.625rem] tracking-widest text-muted-foreground uppercase">
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
