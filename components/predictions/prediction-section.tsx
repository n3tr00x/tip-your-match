import { useId } from 'react';

import type { Fixture } from '@/app/generated/prisma/client';
import { PredictionCard } from '@/components/predictions/prediction-card';
import { PredictionSectionHeader } from '@/components/predictions/prediction-section-header';
import { isFixtureOpenForPrediction } from '@/lib/predictions/rules';

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

	return (
		<section aria-labelledby={headingId} className="space-y-4">
			<PredictionSectionHeader fixtures={fixtures} title={title} now={now} />
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
