'use client';

import type { Fixture, Prediction } from '@/app/generated/prisma/client';
import { Input } from '@/components/ui/input';
import { formatMatchDate } from '@/lib/date';
import { STATUS_LABELS } from '@/lib/fixture-status';
import { getPredictionDeadline } from '@/lib/predictions/rules';
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

type PredictionCardProps = {
	fixture: Fixture;
	isOpen: boolean;
	prediction?: Pick<Prediction, 'homeScore' | 'awayScore'>;
};

type ScoreInputProps = {
	name: 'homeScore' | 'awayScore';
	team: string;
	defaultValue?: number;
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

function PredictionStatus({
	prediction,
}: Pick<PredictionCardProps, 'prediction'>) {
	if (!prediction) {
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
			<span className="text-muted-foreground">
				{fixture.status === 'LIVE' ? 'Na żywo' : 'Wynik'}
			</span>
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
	isOpen,
	prediction,
}: PredictionCardProps) {
	const { date, time } = formatMatchDate(fixture.kickoff);

	return (
		<Card
			size="sm"
			className={cn('ring-0 border-2 shadow', {
				'border-primary/75': isOpen,
				'border-border': !isOpen,
			})}
		>
			<form className="flex flex-col gap-(--card-spacing)">
				<CardHeader className="flex justify-between items-center">
					<CardTitle className="text-muted-foreground tracking-widest text-[0.625rem] uppercase">
						{date} · {time}
					</CardTitle>
					<span className="flex items-center gap-1 text-muted-foreground tracking-widest text-[0.625rem] uppercase">
						<LockStatus fixture={fixture} isOpen={isOpen} />
					</span>
				</CardHeader>

				<input type="hidden" name="fixtureId" value={fixture.id} />

				<fieldset disabled={!isOpen} className="contents">
					<CardContent className="flex flex-col gap-y-4">
						<div className="flex justify-between items-center gap-4">
							<TeamInfo name={fixture.homeTeam} logo={fixture.homeTeamLogo} />
							<ScoreInput
								name="homeScore"
								team={fixture.homeTeam}
								defaultValue={prediction?.homeScore}
							/>
						</div>
						<div className="flex justify-between items-center gap-4">
							<TeamInfo name={fixture.awayTeam} logo={fixture.awayTeamLogo} />
							<ScoreInput
								name="awayScore"
								team={fixture.awayTeam}
								defaultValue={prediction?.awayScore}
							/>
						</div>
					</CardContent>
					<CardFooter className="justify-between gap-4 text-[0.625rem] uppercase tracking-widest">
						<PredictionStatus prediction={prediction} />
						{isOpen ? (
							<Button type="submit" size="sm">
								{prediction ? 'Zmień typ' : 'Zapisz'}
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
