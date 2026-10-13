import type { FixtureStatus } from '@/app/generated/prisma/enums';
import { CheckIcon } from 'lucide-react';
import { PredictionResult } from './prediction-result';

type PredictionStatusProps = {
	status: FixtureStatus;
	isSaved: boolean;
	points: number | null;
};

export function PredictionStatus({
	isSaved,
	status,
	points,
}: PredictionStatusProps) {
	if (status === 'FINISHED') {
		return <PredictionResult isSaved={isSaved} points={points} />;
	}

	if (!isSaved) {
		return <span className="text-muted-foreground">Brak typu</span>;
	}

	return (
		<span className="flex items-center gap-1 text-primary">
			<CheckIcon className="size-3" />
			Typ zapisany
		</span>
	);
}
