'use client';

import { useActionState, useId } from 'react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { LeagueFormState, leaveLeague } from '@/lib/actions/leagues';
import { Button } from '../ui/button';
import { FormErrors } from './form-errors';

type LeaveLeagueDialogProps = {
	leagueId: string;
	leagueName: string;
	isAdmin: boolean;
};

const initialState: LeagueFormState = { success: false };

const DIALOG_COPY = {
	admin: {
		trigger: 'Usuń ligę',
		title: 'Usunąć ligę?',
		pending: 'Usuwanie...',
	},
	member: {
		trigger: 'Opuść ligę',
		title: 'Opuścić ligę?',
		pending: 'Opuszczanie...',
	},
};

export function LeaveLeagueDialog({
	leagueId,
	leagueName,
	isAdmin,
}: LeaveLeagueDialogProps) {
	const [state, formAction, isPending] = useActionState(
		leaveLeague,
		initialState,
	);
	const errorsId = useId();
	const copy = isAdmin ? DIALOG_COPY.admin : DIALOG_COPY.member;

	return (
		<AlertDialog>
			<AlertDialogTrigger render={<Button variant="destructive" />}>
				{copy.trigger}
			</AlertDialogTrigger>
			<AlertDialogContent>
				<form action={formAction} className="grid gap-6">
					<input type="hidden" name="leagueId" value={leagueId} />
					<AlertDialogHeader>
						<AlertDialogTitle>{copy.title}</AlertDialogTitle>
						<AlertDialogDescription>
							{isAdmin ? (
								<>
									Liga <strong>{leagueName}</strong> zostanie usunięta razem z
									rankingiem dla wszystkich członków. Tej operacji nie da się
									cofnąć.
								</>
							) : (
								<>
									Możesz wrócić do ligi <strong>{leagueName}</strong> z jej
									kodem, ale punkty będą liczone od nowa, od bieżącej kolejki.
								</>
							)}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<FormErrors id={errorsId} errors={state.errors} />
					<AlertDialogFooter>
						<AlertDialogCancel disabled={isPending}>Anuluj</AlertDialogCancel>
						<AlertDialogAction
							type="submit"
							variant="destructive"
							disabled={isPending}
						>
							{isPending ? copy.pending : copy.trigger}
						</AlertDialogAction>
					</AlertDialogFooter>
				</form>
			</AlertDialogContent>
		</AlertDialog>
	);
}
