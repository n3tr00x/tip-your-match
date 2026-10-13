import { useId } from 'react';

import type { Fixture } from '@/app/generated/prisma/client';
import { PredictionCard } from '@/components/predictions/prediction-card';
import { PredictionSectionHeader } from '@/components/predictions/prediction-section-header';
import {
	isFixtureOpenForPrediction,
	type UserPrediction,
} from '@/lib/predictions/rules';
import { sumScoredPoints } from '@/lib/predictions/scoring';

type PredictionSectionProps = {
	title: string;
	fixtures: Fixture[];
	predictions: Record<string, UserPrediction>;
	now: Date;
};

export function PredictionSection({
	title,
	fixtures,
	predictions,
	now,
}: PredictionSectionProps) {
	const headingId = useId();
	const totalPoints = sumScoredPoints(
		fixtures.map(fixture => predictions[fixture.id]?.points),
	);

	return (
		<section aria-labelledby={headingId} className="space-y-4">
			<PredictionSectionHeader
				fixtures={fixtures}
				title={title}
				headingId={headingId}
				now={now}
				totalPoints={totalPoints}
			/>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{fixtures.map(fixture => (
					<PredictionCard
						key={fixture.id}
						fixture={fixture}
						prediction={predictions[fixture.id]}
						isOpen={isFixtureOpenForPrediction(fixture, now)}
					/>
				))}
			</div>
		</section>
	);
}
