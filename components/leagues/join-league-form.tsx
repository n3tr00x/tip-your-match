'use client';

import { useActionState, useId } from 'react';
import { joinLeague, type LeagueFormState } from '@/lib/actions/leagues';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormErrors } from '@/components/leagues/form-errors';

const initialState: LeagueFormState = { success: false };

export function JoinLeagueForm() {
	const [state, formAction, isPending] = useActionState(
		joinLeague,
		initialState,
	);
	const inputId = useId();
	const errorsId = useId();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Dołącz do ligi</CardTitle>
				<CardDescription>
					Wpisz kod otrzymany od administratora ligi
				</CardDescription>
			</CardHeader>
			<form action={formAction}>
				<CardContent className="space-y-2">
					<Label htmlFor={inputId}>Kod ligi</Label>
					<Input
						aria-invalid={!!state.errors}
						aria-describedby={state.errors ? errorsId : undefined}
						id={inputId}
						name="code"
						defaultValue={state.value}
						placeholder="ABCD2345"
						autoComplete="off"
						autoCapitalize="characters"
						spellCheck="false"
						required
						className="font-mono uppercase tracking-widest"
					/>
					<FormErrors id={errorsId} errors={state.errors} />
				</CardContent>
				<CardFooter>
					<Button type="submit" variant="outline" disabled={isPending}>
						{isPending ? 'Dołączanie…' : 'Dołącz'}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
