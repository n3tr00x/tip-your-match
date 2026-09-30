import { useId } from 'react';

import type { Fixture } from '@/app/generated/prisma/client';
import { formatDateRange } from '@/lib/date';
import { isFixtureOpenForPrediction } from '@/lib/predictions/rules';
import { PredictionCard } from '@/components/predictions/prediction-card';

type PredictionSectionProps = {
	title: string;
	fixtures: Fixture[];
	now: Date;
};

export function PredictionSection({
	title,
	fixtures,
	now,
}: PredictionSectionProps) {
	const headingId = useId();

	const firstKickoff = fixtures[0].kickoff;
	const lastKickoff = fixtures[fixtures.length - 1].kickoff;
	const openCount = fixtures.filter(fixture =>
		isFixtureOpenForPrediction(fixture, now),
	).length;

	return (
		<section aria-labelledby={headingId} className="space-y-4">
			<div className="flex items-center justify-between gap-4 border-b pb-2">
				<h2
					id={headingId}
					className="font-heading uppercase tracking-widest tabular-nums"
				>
					{title}
				</h2>
				<div className="flex items-center gap-4 text-xs text-muted-foreground tabular-nums">
					<span className="hidden sm:inline">
						{formatDateRange(firstKickoff, lastKickoff)}
					</span>
					<span>
						Otwarte: {openCount}/{fixtures.length}
					</span>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{fixtures.map(fixture => (
					<PredictionCard
						key={fixture.id}
						fixture={fixture}
						isOpen={isFixtureOpenForPrediction(fixture, now)}
					/>
				))}
			</div>
		</section>
	);
}
