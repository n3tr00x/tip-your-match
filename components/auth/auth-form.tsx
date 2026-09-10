'use client';

import Link from 'next/link';

import { AuthTabs } from '@/components/auth/auth-tabs';
import { OAuthButtons } from '@/components/auth/o-auth-buttons';
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

export function LoginForm() {
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

				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="login-email">Adres e-mail</Label>
						<Input
							id="login-email"
							type="email"
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
							type="password"
							placeholder="••••••••"
							autoComplete="current-password"
						/>
					</div>
				</CardContent>

				<CardFooter className="flex flex-col gap-3">
					<Button type="submit" className="w-full">
						Zaloguj się
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
			</Card>
		</div>
	);
}

export function RegisterForm() {
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

				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="register-email">Adres e-mail</Label>
						<Input
							id="register-email"
							type="email"
							placeholder="name@example.com"
							autoComplete="email"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="register-password">Hasło</Label>
						<Input
							id="register-password"
							type="password"
							placeholder="Wprowadź hasło"
							autoComplete="new-password"
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="register-confirm-password">Powtórz hasło</Label>
						<Input
							id="register-confirm-password"
							type="password"
							placeholder="Potwierdź hasło"
							autoComplete="new-password"
						/>
					</div>
				</CardContent>

				<CardFooter className="flex flex-col gap-3">
					<Button type="submit" className="w-full">
						Zarejestruj się
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
			</Card>
		</div>
	);
}
