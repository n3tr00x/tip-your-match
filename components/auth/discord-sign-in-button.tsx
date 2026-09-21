'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { DiscordIcon } from '@/components/ui/icons';
import {
	signInWithDiscord,
	signInWithSocialProvider,
} from '@/lib/actions/auth';
import { errorFormFieldsToast } from '@/lib/toasts/auth';

export function DiscordSignInButton() {
	const [isPending, startTransition] = useTransition();

	const signInWithDiscordHandler = () => {
		startTransition(async () => {
			const result = await signInWithSocialProvider('discord');

			if (!result.success || !result.url) {
				errorFormFieldsToast(result.errors ?? 'Wystąpił błąd.');
				return;
			}

			window.location.href = result.url;
		});
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
