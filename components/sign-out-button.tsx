'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signout } from '@/lib/actions/auth';
import { errorFormFieldsToast, successSignOutToast } from '@/lib/toasts/auth';
import { LogOutIcon } from 'lucide-react';

export function SignOutButton() {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const signOutHandler = async () => {
		startTransition(async () => {
			const result = await signout();

			if (!result.success && result.errors) {
				errorFormFieldsToast(result.errors);
				return;
			}

			if (result.success) {
				successSignOutToast();
				router.replace('/login');
			}
		});
	};

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={signOutHandler}
			disabled={isPending}
		>
			<LogOutIcon />
			Wyloguj
		</Button>
	);
}
