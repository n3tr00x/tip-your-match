'use client';

import { useActionState, useId } from 'react';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { createLeague, type LeagueFormState } from '@/lib/actions/leagues';
import { LEAGUE_LIMITS } from '@/lib/leagues/rules';
import { Input } from '../ui/input';
import { FormErrors } from '../form-errors';
import { Button } from '../ui/button';

type CreateLeagueFormProps = {
	createdCount: number;
};

const initialState: LeagueFormState = { success: false };

export function CreateLeagueForm({ createdCount }: CreateLeagueFormProps) {
	const [state, formAction, isPending] = useActionState(
		createLeague,
		initialState,
	);

	const inputId = useId();
	const errorsId = useId();
	const isLimitReached = createdCount >= LEAGUE_LIMITS.MAX_CREATED;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Utwórz Ligę</CardTitle>
				<CardDescription>
					Utworzone w tym sezonie: {createdCount}/{LEAGUE_LIMITS.MAX_CREATED}
				</CardDescription>
			</CardHeader>
			<form action={formAction}>
				<CardContent className="space-y-2">
					<Label htmlFor={inputId}>Nazwa Ligi</Label>
					<Input
						aria-invalid={!!state.errors}
						aria-describedby={state.errors ? errorsId : undefined}
						id={inputId}
						name="name"
						defaultValue={state.value}
						placeholder="np. Liga z pracy"
						minLength={3}
						maxLength={40}
						required
						disabled={isLimitReached}
					/>
					<FormErrors id={errorsId} errors={state.errors} />
				</CardContent>
				<CardFooter>
					<Button type="submit" disabled={isPending || isLimitReached}>
						{isPending ? 'Tworzenie...' : 'Utwórz Ligę'}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
