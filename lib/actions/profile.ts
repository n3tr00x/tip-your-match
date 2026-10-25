'use server';

import { requireSession } from '@/lib/session';
import { profileSchema } from '@/lib/profile/schema';
import { auth } from '../auth';
import { headers } from 'next/headers';
import { APIError } from 'better-auth';
import { refresh } from 'next/cache';

export type ProfileFormState = {
	success: boolean;
	errors?: string[];
};

export async function updateProfile(
	_previousState: ProfileFormState,
	formData: FormData,
) {
	await requireSession();

	const parsed = profileSchema.safeParse({
		name: formData.get('name'),
		bio: formData.get('bio'),
	});

	if (!parsed.success) {
		return {
			success: false,
			errors: parsed.error.issues.map(issue => issue.message),
		};
	}

	try {
		await auth.api.updateUser({
			body: parsed.data,
			headers: await headers(),
		});
	} catch (error) {
		if (error instanceof APIError) {
			return { success: false, errors: [error.message] };
		}

		console.error('Unexpected update profile error', error);

		return {
			success: false,
			errors: ['Wystąpił nieoczekiwany błąd, spróbuj ponownie później.'],
		};
	}

	refresh();

	return { success: true };
}
