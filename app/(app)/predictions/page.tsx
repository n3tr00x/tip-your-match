import { requireSession } from '@/lib/session';
import { getSeasonFixtures } from '@/lib/schedule/queries';
import { requireEnvVariable } from '@/lib/utils';
import { getPredictableFixtures } from '@/lib/predictions/rounds';
import { PredictionSection } from '@/components/predictions/prediction-section';
import { getUserPredictions } from '@/lib/predictions/queries';
import { resolveCurrentRound } from '@/lib/schedule/rounds';

export default async function PredictionsPage() {
	const season = requireEnvVariable('FOOTBALL_API_SEASON');
	const now = new Date();

	const session = await requireSession();
	const userId = session.user.id;

	const { fixtures, currentMatchday } = await getSeasonFixtures(
		Number(season),
		now,
	);
	const currentRound = resolveCurrentRound(fixtures, currentMatchday, now);
	const { round, moved, awaitingDate } = getPredictableFixtures(
		fixtures,
		currentRound,
		now,
	);

	const combinedFixturesIds = [
		...moved.map(f => f.id),
		...(round?.fixtures.map(f => f.id) ?? []),
		...awaitingDate.map(f => f.id),
	];

	const predictions = await getUserPredictions(userId, combinedFixturesIds);

	return (
		<div className="max-w-7xl mx-auto space-y-8 my-6">
			{!round && moved.length === 0 && awaitingDate.length === 0 && (
				<p>Brak meczów do wytypowania.</p>
			)}
			{moved.length > 0 && (
				<PredictionSection
					title="Mecze przeniesione"
					fixtures={moved}
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
			{awaitingDate.length > 0 && (
				<PredictionSection
					title="Czekają na nowy termin"
					fixtures={awaitingDate}
					predictions={predictions}
					now={now}
				/>
			)}
		</div>
	);
}
