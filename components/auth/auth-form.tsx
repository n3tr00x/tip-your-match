'use client';

import {
	errorFormFieldsToast,
	successSignInToast,
	successSignUpToast,
} from '@/lib/toasts/auth';

import Link from 'next/link';

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
import { signin, signup } from '@/lib/actions/auth';
import { SubmitEvent, useTransition } from 'react';
import { toast } from '@/components/ui/toast';
import { redirect } from 'next/navigation';
import { cn } from 'cn';

export function LoginForm() {
	const [isPending, startTransition] = useTransition();

	const signInHandler = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		startTransition(async () => {
			const formData = new FormData(event.currentTarget);
			const result = await signin(formData);

			console.log(result.errors);

			if (!result.success && result.errors) {
				errorFormFieldsToast(result.errors);
				return;
			}

			successSignInToast();
			redirect('/');
		});
	};

	return (
		<div className="w-full max-w-md">
			<AuthTabs />

			<Card>
				<CardHeader className="space-y-2">
					<CardTitle className="text-2xl">Witamy ponownie</CardTitle>
					<CardDescription>
						Zaloguj się, aby kontynuować dostęp do swojego konta.
					</CardDescription>
				</CardHeader>
				<form onSubmit={signInHandler}>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="login-email">Adres e-mail</Label>
							<Input
								id="login-email"
								type="email"
								name="email"
								placeholder="nazwa@domena.com"
								autoComplete="email"
							/>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="login-password">Hasło</Label>
								<Button variant="link" size="sm" className="h-auto p-0">
									Zapomniałeś hasła?
								</Button>
							</div>
							<Input
								id="login-password"
								name="password"
								type="password"
								placeholder="••••••••"
								autoComplete="current-password"
							/>
						</div>
					</CardContent>

					<CardFooter className="flex flex-col gap-3">
						<Button type="submit" className="w-full" disabled={isPending}>
							{isPending ? 'Logowanie...' : 'Zaloguj się'}
						</Button>

						<OAuthButtons />

						<p className="text-sm text-muted-foreground">
							Nie masz konta?{' '}
							<Link
								href="/register"
								className="font-medium text-primary underline-offset-4 hover:underline"
							>
								Zarejestruj się
							</Link>
						</p>
					</CardFooter>
				</form>
			</Card>
		</div>
	);
}

export function RegisterForm() {
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

			successSignUpToast();
			redirect('/login');
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
