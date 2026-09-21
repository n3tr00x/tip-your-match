'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useTransition } from 'react';

import { AuthTabs } from '@/components/auth/auth-tabs';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
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
import { signup } from '@/lib/actions/auth';
import { errorFormFieldsToast, successSignUpToast } from '@/lib/toasts/auth';

export function RegisterForm() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const signUpHandler = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		startTransition(async () => {
			const formData = new FormData(event.currentTarget);
			const result = await signup(formData);

			if (!result.success && result.errors) {
				errorFormFieldsToast(result.errors);
				return;
			}

			if (result.success) {
				successSignUpToast();
				router.push('/login');
			}
		});
	};

	return (
		<div className="w-full max-w-md">
			<AuthTabs />

			<Card>
				<CardHeader className="space-y-2">
					<CardTitle className="text-2xl">Utwórz konto</CardTitle>
					<CardDescription>
						Wypełnij dane, aby założyć nowe konto w kilka sekund.
					</CardDescription>
				</CardHeader>
				<form onSubmit={signUpHandler}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="register-email">Adres e-mail</Label>
							<Input
								id="register-email"
								type="email"
								name="email"
								placeholder="name@example.com"
								autoComplete="email"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="register-password">Hasło</Label>
							<Input
								id="register-password"
								name="password"
								type="password"
								placeholder="Wprowadź hasło"
								autoComplete="new-password"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="register-confirm-password">Powtórz hasło</Label>
							<Input
								id="register-confirm-password"
								name="confirmPassword"
								type="password"
								placeholder="Potwierdź hasło"
								autoComplete="new-password"
							/>
						</div>
					</CardContent>

					<CardFooter className="flex flex-col gap-3">
						<Button type="submit" disabled={isPending} className="w-full">
							{isPending ? 'Rejestracja...' : 'Zarejestruj się'}
						</Button>

						<OAuthButtons />

						<p className="text-sm text-muted-foreground">
							Masz już konto?{' '}
							<Link
								href="/login"
								className="font-medium text-primary underline-offset-4 hover:underline"
							>
								Zaloguj się
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}
