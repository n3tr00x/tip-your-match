'use client';

import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/ui/icons';
import { signInWithSocialProvider } from '@/lib/actions/auth';
import { errorFormFieldsToast } from '@/lib/toasts/auth';

export function GoogleSignInButton() {
	const [isPending, startTransition] = useTransition();

	const signInWithGoogleHandler = () => {
		startTransition(async () => {
			const result = await signInWithSocialProvider('google');

			if (!result.success || !result.url) {
				errorFormFieldsToast(result.errors ?? 'Wystąpił błąd.');
				return;
			}

			window.location.href = result.url;
		});
	};

	return (
		<Button
			variant="outline"
			type="button"
			className="w-full"
			disabled={isPending}
			onClick={signInWithGoogleHandler}
		>
			<GoogleIcon />
			Google
		</Button>
	);
}
