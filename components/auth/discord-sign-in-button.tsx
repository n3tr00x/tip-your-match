'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { DiscordIcon } from '@/components/ui/icons';
import { signInWithDiscord } from '@/lib/actions/auth';
import { errorFormFieldsToast, successSignInToast } from '@/lib/toasts/auth';
import { redirect } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export function DiscordSignInButton() {
	const [isPending, startTransition] = useTransition();

	const signInWithDiscordHandler = () => {
		startTransition(async () => {
			await authClient.signIn.social(
				{ provider: 'discord', callbackURL: '/' },
				{
					onSuccess: ctx => redirect(ctx.data?.url),
					onError: ctx => {},
				},
			);
		});

		// startTransition(async () => {
		// 	const result = await signInWithDiscord();

		// 	if (!result.success || !result.url) {
		// 		errorFormFieldsToast(result.errors ?? 'Wystąpił błąd.');
		// 		return;
		// 	}

		// 	redirect(result.url);
		// });
		// successSignInToast();
	};

	return (
		<Button
			type="button"
			variant="outline"
			className="w-full"
			disabled={isPending}
			onClick={signInWithDiscordHandler}
		>
			<DiscordIcon />
			Discord
		</Button>
	);
}
