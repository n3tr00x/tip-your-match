'use client';

import { useActionState, useId, useState } from 'react';
import { FormErrors } from '@/components/form-errors';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProfileFormState, updateProfile } from '@/lib/actions/profile';
import { successProfileToast } from '@/lib/toasts/profile';
import { PROFILE_LIMITS } from '@/lib/profile/rules';

type ProfileFormProps = { name: string; bio: string };

const initialState: ProfileFormState = { success: false };

export function ProfileForm({
	name: savedName,
	bio: savedBio,
}: ProfileFormProps) {
	const [name, setName] = useState(savedName);
	const [bio, setBio] = useState(savedBio);
	const [state, formAction, isPending] = useActionState(
		async (previousState: ProfileFormState, formData: FormData) => {
			const result = await updateProfile(previousState, formData);

			if (result.success) {
				successProfileToast();
			}

			return result;
		},
		initialState,
	);

	const nameId = useId();
	const nameHintId = useId();
	const bioId = useId();
	const bioCounterId = useId();
	const errorsId = useId();

	return (
		<Card>
			<CardHeader>
				<CardTitle>Edytuj profil</CardTitle>
			</CardHeader>
			<form action={formAction}>
				<CardContent className="space-y-6">
					<div className="space-y-2">
						<Label htmlFor={nameId}>Nazwa wyświetlana</Label>
						<Input
							aria-describedby={nameHintId}
							id={nameId}
							name="name"
							value={name}
							minLength={PROFILE_LIMITS.NAME_MIN}
							maxLength={PROFILE_LIMITS.NAME_MAX}
							autoComplete="nickname"
							required
							onChange={event => setName(event.target.value)}
						/>
						<p id={nameHintId} className="text-muted-foreground text-xs">
							Widoczna w rankingach i ligach.
						</p>
					</div>
					<div className="space-y-2">
						<Label htmlFor={bioId}>O mnie</Label>
						<Textarea
							aria-describedby={bioCounterId}
							id={bioId}
							name="bio"
							value={bio}
							maxLength={PROFILE_LIMITS.BIO_MAX}
							rows={4}
							placeholder="Kilka słów o sobie i swoim typowaniu"
							onChange={event => setBio(event.target.value)}
						/>
						<p
							id={bioCounterId}
							className="text-right text-xs text-muted-foreground tabular-nums"
						>
							{bio.length}/{PROFILE_LIMITS.BIO_MAX}
						</p>
					</div>
					<FormErrors id={errorsId} errors={state?.errors} />
				</CardContent>

				<CardFooter>
					<Button type="submit" disabled={isPending}>
						{isPending ? 'Zapisywanie...' : 'Zapisz zmiany'}
					</Button>
				</CardFooter>
			</form>
		</Card>
	);
}
