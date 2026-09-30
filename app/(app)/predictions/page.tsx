import { connection } from 'next/server';

import { getSeasonFixtures } from '@/lib/schedule/queries';
import { requireEnvVariable } from '@/lib/utils';
import { getPredictableFixtures } from '@/lib/predictions/rounds';
import { PredictionSection } from '@/components/predictions/prediction-section';

export default async function PredictionsPage() {
	await connection();

	const now = new Date();
	const season = requireEnvVariable('FOOTBALL_API_SEASON');
	const fixtures = await getSeasonFixtures(Number(season));
	const { round, overdue } = getPredictableFixtures(fixtures, now);

	return (
		<div className="max-w-7xl mx-auto space-y-8 my-6">
			{!round && overdue.length === 0 && <p>Brak meczów w tej kolejce.</p>}
			{overdue.length > 0 && (
				<PredictionSection title="Zaległe mecze" fixtures={overdue} now={now} />
			)}
			{round && (
				<PredictionSection
					title={`Runda ${round.round}`}
					fixtures={round.fixtures}
					now={now}
				/>
			)}
		</div>
	);
}
