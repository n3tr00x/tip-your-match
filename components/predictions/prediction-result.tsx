import {
	CheckIcon,
	CircleCheckBigIcon,
	HourglassIcon,
	XIcon,
	type LucideIcon,
} from 'lucide-react';

import { POINTS } from '@/lib/predictions/scoring';
import { cn } from '@/lib/utils';

export type PredictionResultProps = {
	isSaved: boolean;
	points: number | null;
};

type ResultVariant = {
	label: string;
	icon: LucideIcon;
	textClassName: string;
	cardClassName: string;
};

const RESULT_VARIANTS: Record<string, ResultVariant> = {
	[POINTS.EXACT]: {
		label: 'Dokładny wynik',
		icon: CircleCheckBigIcon,
		textClassName: 'text-success',
		cardClassName: 'border-success/60 bg-success/5',
	},
	[POINTS.OUTCOME]: {
		label: 'Trafiony rezultat',
		icon: CheckIcon,
		textClassName: 'text-info',
		cardClassName: 'border-info/50 bg-info/5',
	},
	[POINTS.MISS]: {
		label: 'Pudło',
		icon: XIcon,
		textClassName: 'text-destructive',
		cardClassName: 'border-destructive/50 bg-destructive/5',
	},
};

export const getResultVariant = (points: number | null) => {
	return points === null ? undefined : RESULT_VARIANTS[points];
};

const formatPoints = (points: number) => {
	return points > 0 ? `+${points}` : `${points}`;
};

export function PredictionResult({ isSaved, points }: PredictionResultProps) {
	if (!isSaved) {
		return <span className="text-muted-foreground">Brak typu · 0</span>;
	}

	const variant = getResultVariant(points);

	if (points === null || !variant) {
		return (
			<span className="flex items-center gap-1 text-muted-foreground">
				<HourglassIcon className="size-3" />
				Oczekuje na rozliczenie
			</span>
		);
	}

	const Icon = variant.icon;

	return (
		<span className={cn('flex items-center gap-1', variant.textClassName)}>
			<Icon className="size-3" />
			{variant.label} · {formatPoints(points)}
		</span>
	);
}
