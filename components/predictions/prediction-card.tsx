'use client';

import { useActionState } from 'react';

import type { Fixture } from '@/app/generated/prisma/client';
import { LockStatus } from '@/components/predictions/lock-status';
import { ScoreInput } from '@/components/predictions/score-input';
import {
	getResultVariant,
	type PointsValue,
} from '@/components/predictions/prediction-result';
import { PredictionStatus } from '@/components/predictions/prediction-status';
import { MatchScore } from '@/components/predictions/match-score';
import { TeamInfo } from '@/components/team-info';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	savePrediction,
	type PredictionFormState,
} from '@/lib/actions/predictions';
import { formatMatchDate } from '@/lib/date';
import { type UserPrediction } from '@/lib/predictions/rules';
import {
	errorPredictionToast,
	successPredictionToast,
} from '@/lib/toasts/predictions';
import { cn } from '@/lib/utils';

export type PredictionCardProps = {
	fixture: Fixture;
	isOpen: boolean;
	prediction?: UserPrediction;
};

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
	const resultVariant =
		fixture.status === 'FINISHED'
			? getResultVariant((prediction?.points as PointsValue) ?? null)
			: undefined;

	return (
		<Card
			size="sm"
			className={cn(
				'ring-0 border-2 shadow',
				resultVariant?.cardClassName ?? {
					'border-primary/75': isOpen,
					'border-border': !isOpen,
				},
			)}
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
						<PredictionStatus
							status={fixture.status}
							points={prediction?.points ?? null}
							isSaved={isSaved}
						/>
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
