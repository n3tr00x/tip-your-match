import { Fixture } from '@/app/generated/prisma/client';

type MatchScoreProps = { fixture: Pick<Fixture, 'homeScore' | 'awayScore'> };

export function MatchScore({ fixture }: MatchScoreProps) {
	if (fixture.homeScore === null || fixture.awayScore === null) {
		return null;
	}

	return (
		<span className="flex items-center gap-2">
			<span className="font-heading text-lg tabular-nums">
				{fixture.homeScore}:{fixture.awayScore}
			</span>
		</span>
	);
}
