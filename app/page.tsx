'use client';

import { AuthRedirectToast } from '@/components/auth/auth-redirect-toast';
import { Button } from '@/components/ui/button';
import { signout } from '@/lib/actions/auth';
import { errorFormFieldsToast, successSignOutToast } from '@/lib/toasts/auth';
import { useRouter } from 'next/navigation';
import { SubmitEvent, Suspense } from 'react';

export default function Home() {
	const router = useRouter();

	const signOutHandler = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
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
		<div className="flex justify-center">
			<Suspense>
				<AuthRedirectToast />
			</Suspense>
			<form onSubmit={signOutHandler}>
				<Button type="submit">Click me</Button>
			</form>
		</div>
	);
}
