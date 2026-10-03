import { toast } from '@/components/ui/toast';

export function errorPredictionToast(errors: string[]) {
	return toast.add({
		type: 'error',
		title: 'Nie udało się zapisać typu',
		description: (
			<span className="flex flex-col gap-1 text-xs">
				{errors.map((error, index) => (
					<span key={index}>{error}</span>
				))}
			</span>
		),
	});
}

export function successPredictionToast(
	homeTeam: string,
	awayTeam: string,
	score: { homeScore: string; awayScore: string },
) {
	return toast.add({
		type: 'success',
		title: 'Typ zapisany',
		description: `${homeTeam} ${score.homeScore}:${score.awayScore} ${awayTeam}`,
	});
}
