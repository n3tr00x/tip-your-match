'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useTransition } from 'react';

import { AuthTabs } from '@/components/auth/auth-tabs';
import { OAuthButtons } from '@/components/auth/oauth-buttons';
import { Button } from '@/components/ui/button';
import { signin } from '@/lib/actions/auth';
import { errorFormFieldsToast, successSignInToast } from '@/lib/toasts/auth';

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

export function LoginForm() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const signInHandler = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		startTransition(async () => {
			const formData = new FormData(event.currentTarget);
			const result = await signin(formData);

			if (!result.success && result.errors) {
				errorFormFieldsToast(result.errors);
				return;
			}

			if (result.success) {
				successSignInToast();
				router.push('/');
			}

			// redirect('/');
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
