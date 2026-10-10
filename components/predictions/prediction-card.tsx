'use client';

import type { Fixture } from '@/app/generated/prisma/client';
import { Input } from '@/components/ui/input';
import { formatMatchDate } from '@/lib/date';
import { STATUS_LABELS } from '@/lib/fixture-status';
import {
	getPredictionDeadline,
	type PredictionScore,
} from '@/lib/predictions/rules';
import { CheckIcon, ClockIcon, LockIcon } from 'lucide-react';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TeamInfo } from '@/components/team-info';
import { Button } from '@/components/ui/button';
import { useActionState } from 'react';
import {
	savePrediction,
	type PredictionFormState,
} from '@/lib/actions/predictions';
import {
	errorPredictionToast,
	successPredictionToast,
} from '@/lib/toasts/predictions';

type PredictionCardProps = {
	fixture: Fixture;
	isOpen: boolean;
	prediction?: PredictionScore;
};

type ScoreInputProps = {
	name: 'homeScore' | 'awayScore';
	team: string;
	defaultValue?: number | string;
};

function ScoreInput({ name, team, defaultValue }: ScoreInputProps) {
	return (
		<Input
			aria-label={`Gole: ${team}`}
			type="number"
			name={name}
			inputMode="numeric"
			defaultValue={defaultValue}
			placeholder="-"
			min={0}
			max={20}
			required
			className="w-12 shrink-0 text-center font-heading text-lg tabular-nums [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
		/>
	);
}

function PredictionStatus({ isSaved }: { isSaved: boolean }) {
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

function MatchScore({ fixture }: Pick<PredictionCardProps, 'fixture'>) {
	if (fixture.homeScore === null || fixture.awayScore === null) {
		return null;
	}

	return (
		<span className="flex items-center gap-2">
			<span className="font-heading text-lg tabular-nums">
				{fixture.homeScore}:{fixture.awayScore}
			</span>
		</span>
	);
}

function LockStatus({
	fixture,
	isOpen,
}: Pick<PredictionCardProps, 'fixture' | 'isOpen'>) {
	if (isOpen) {
		const { time } = formatMatchDate(getPredictionDeadline(fixture.kickoff));

		return (
			<>
				<ClockIcon className="size-3" />
				Do {time}
			</>
		);
	}

	if (fixture.status === 'SCHEDULED') {
		return (
			<>
				<LockIcon className="size-3" />
				Zamknięte
			</>
		);
	}

	return STATUS_LABELS[fixture.status];
}

export function PredictionCard({
	fixture,
	prediction,
	isOpen,
}: PredictionCardProps) {
	const [state, formAction, isPending] = useActionState(
		async (previousState: PredictionFormState, formData: FormData) => {
			let result: PredictionFormState;

			// The action handles its own errors, but the request itself can still
			// fail (network loss, server restart). Without catching it here,
			// useActionState would rethrow the error to the nearest error boundary.
			try {
				result = await savePrediction(previousState, formData);
			} catch (error) {
				console.error('Save prediction request failed', error);

				result = {
					success: false,
					errors: ['Nie udało się połączyć z serwerem. Spróbuj ponownie.'],
					values: {
						homeScore: String(formData.get('homeScore') ?? ''),
						awayScore: String(formData.get('awayScore') ?? ''),
					},
				};
			}

			if (result.success && result.values) {
				successPredictionToast(
					fixture.homeTeam,
					fixture.awayTeam,
					result.values,
				);
			}

			if (!result.success && result.errors) {
				errorPredictionToast(result.errors);
			}

			return result;
		},
		{ success: false },
	);

	const { date, time } = formatMatchDate(fixture.kickoff);
	const isSaved = Boolean(prediction) || state.success;

	return (
		<Card
			size="sm"
			className={cn('ring-0 border-2 shadow', {
				'border-primary/75': isOpen,
				'border-border': !isOpen,
			})}
		>
			<form action={formAction} className="flex flex-col gap-(--card-spacing)">
				<CardHeader className="flex justify-between items-center">
					<CardTitle className="text-muted-foreground tracking-widest text-[0.625rem] uppercase">
						{fixture.status === 'POSTPONED'
							? 'Termin do ustalenia'
							: `${date} · ${time}`}
					</CardTitle>
					<span className="flex items-center gap-1 text-muted-foreground tracking-widest text-[0.625rem] uppercase">
						<LockStatus fixture={fixture} isOpen={isOpen} />
					</span>
				</CardHeader>

				<input type="hidden" name="fixtureId" value={fixture.id} />

				<fieldset disabled={!isOpen || isPending} className="contents">
					<CardContent className="flex flex-col gap-y-4">
						<div className="flex justify-between items-center gap-4">
							<TeamInfo name={fixture.homeTeam} logo={fixture.homeTeamLogo} />
							<ScoreInput
								name="homeScore"
								team={fixture.homeTeam}
								defaultValue={state.values?.homeScore ?? prediction?.homeScore}
							/>
						</div>
						<div className="flex justify-between items-center gap-4">
							<TeamInfo name={fixture.awayTeam} logo={fixture.awayTeamLogo} />
							<ScoreInput
								name="awayScore"
								team={fixture.awayTeam}
								defaultValue={state.values?.awayScore ?? prediction?.awayScore}
							/>
						</div>
					</CardContent>
					<CardFooter className="justify-between gap-4 text-[0.625rem] uppercase tracking-widest">
						<PredictionStatus isSaved={isSaved} />
						{isOpen ? (
							<Button type="submit" size="sm">
								{isPending ? 'Zapisywanie…' : isSaved ? 'Zmień typ' : 'Zapisz'}
							</Button>
						) : (
							<MatchScore fixture={fixture} />
						)}
					</CardFooter>
				</fieldset>
			</form>
		</Card>
	);
}
