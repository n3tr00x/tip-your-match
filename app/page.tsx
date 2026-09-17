'use client';

import { Button } from '@/components/ui/button';
import { signout } from '@/lib/actions/auth';
import { errorFormFieldsToast } from '@/lib/toasts/auth';
import { redirect } from 'next/navigation';
import { SubmitEvent } from 'react';

export default function Home() {
	const signOutHandler = async (event: SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		const result = await signout();

		if (!result.success && result.errors) {
			errorFormFieldsToast(result.errors);
			return;
		}

		redirect('/login');
	};

	return (
		<div className="flex justify-center">
			<form onSubmit={signOutHandler}>
				<Button type="submit">Click me</Button>
			</form>
		</div>
	);
}
