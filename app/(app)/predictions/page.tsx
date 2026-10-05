import { connection } from 'next/server';
import { requireSession } from '@/lib/session';
import { getSeasonFixtures } from '@/lib/schedule/queries';
import { requireEnvVariable } from '@/lib/utils';
import { getPredictableFixtures } from '@/lib/predictions/rounds';
import { PredictionSection } from '@/components/predictions/prediction-section';
import { getUserPredictions } from '@/lib/predictions/queries';

export default async function PredictionsPage() {
	await connection();
	const season = requireEnvVariable('FOOTBALL_API_SEASON');
	const now = new Date();

	const session = await requireSession();
	const userId = session.user.id;

	const fixtures = await getSeasonFixtures(Number(season));
	const { round, overdue } = getPredictableFixtures(fixtures, now);

	const combinedFixturesIds = [
		...overdue.map(f => f.id),
		...(round?.fixtures.map(f => f.id) ?? []),
	];

	const predictions = await getUserPredictions(userId, combinedFixturesIds);

	return (
		<div className="max-w-7xl mx-auto space-y-8 my-6">
			{!round && overdue.length === 0 && <p>Brak meczów do wytypowania.</p>}
			{overdue.length > 0 && (
				<PredictionSection
					title="Zaległe mecze"
					fixtures={overdue}
					predictions={predictions}
					now={now}
				/>
			)}
			{round && (
				<PredictionSection
					title={`Kolejka ${round.round}`}
					fixtures={round.fixtures}
					predictions={predictions}
					now={now}
				/>
			)}
		</div>
	);
}
