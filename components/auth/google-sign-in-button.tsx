import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/ui/icons';
import { authClient } from '@/lib/auth-client';
import { successSignInToast } from '@/lib/toasts/auth';

export function GoogleSignInButton() {
	const [isPending, startTransition] = useTransition();

	const signInWithGoogleHandler = () => {
		startTransition(async () => {
			await authClient.signIn.social(
				{ provider: 'google', callbackURL: '/' },
				{
					onSuccess: () => {
						successSignInToast();
					},
					onError: ctx => {
						console.error('Google sign-in error:', ctx);
					},
				},
			);
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
