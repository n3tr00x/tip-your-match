'use client';

import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { signout } from '@/lib/actions/auth';
import { errorFormFieldsToast, successSignOutToast } from '@/lib/toasts/auth';

export function SignOutButton() {
	const router = useRouter();

	const signOutHandler = async () => {
		const result = await signout();

		if (!result.success && result.errors) {
			errorFormFieldsToast(result.errors);
			return;
		}

		if (result.success) {
			successSignOutToast();
			router.push('/login');
		}
	};

	return (
		<Button variant="outline" size="sm" onClick={signOutHandler}>
			<LogOutIcon />
			Wyloguj
		</Button>
	);
}
