import { formatDateRange } from '@/lib/date';
import type { Fixture } from '@/app/generated/prisma/client';
import { isFixtureOpenForPrediction } from '@/lib/predictions/rules';

type PredictionSectionHeaderProps = {
	fixtures: Fixture[];
	title: string;
	now: Date;
	headingId: string;
};

export function PredictionSectionHeader({
	fixtures,
	title,
	now,
	headingId,
}: PredictionSectionHeaderProps) {
	// Postponed fixtures keep their old kickoff until a new date is set.
	const datedFixtures = fixtures.filter(
		fixture => fixture.status !== 'POSTPONED',
	);
	const firstKickoff = datedFixtures.at(0)?.kickoff;
	const lastKickoff = datedFixtures.at(-1)?.kickoff;
	const openCount = fixtures.filter(fixture =>
		isFixtureOpenForPrediction(fixture, now),
	).length;

	return (
		<div className="flex items-center justify-between gap-4 border-b pb-2">
			<h2
				id={headingId}
				className="font-heading uppercase tracking-widest tabular-nums"
			>
				{title}
			</h2>
			<div className="flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
				{firstKickoff && lastKickoff && (
					<span className="hidden sm:inline">
						{formatDateRange(firstKickoff, lastKickoff)}
					</span>
				)}
				<span>
					Otwarte: {openCount}/{fixtures.length}
				</span>
			</div>
		</div>
	);
}
