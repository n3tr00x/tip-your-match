'use server';

import * as z from 'zod';
import { auth } from '../auth';
import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const signUpSchema = z
	.object({
		email: z.email('Nieprawidłowy adres e-mail'),
		password: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
		confirmPassword: z.string().min(8, 'Hasło musi mieć co najmniej 8 znaków'),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Hasła muszą być takie same. Spróbuj ponownie.',
		path: ['confirmPassword'],
	});

const signInSchema = z.object({
	email: z.email('Nieprawidłowy adres e-mail'),
	password: z.string().min(1),
});

export async function signup(data: FormData) {
	const parsedData = signUpSchema.safeParse({
		email: data.get('email') as string,
		password: data.get('password') as string,
		confirmPassword: data.get('confirmPassword') as string,
	});

	if (!parsedData.success) {
		const { fieldErrors } = z.flattenError(parsedData.error);
		console.error(Object.values(fieldErrors).flat());
		return { success: false, errors: Object.values(fieldErrors).flat() };
	}

	const { email, password } = parsedData.data;
	try {
		await auth.api.signUpEmail({
			body: { email, password, name: email.split('@')[0] },
		});
	} catch (error) {
		if (error instanceof APIError) {
			return { success: false, errors: error.message };
		}
		console.error('Unexpected signup error', error);
		return {
			success: false,
			errors: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.',
		};
	}

	return { success: true };
}

export async function signin(data: FormData) {
	const parsedData = signInSchema.safeParse({
		email: data.get('email') as string,
		password: data.get('password') as string,
	});

	if (!parsedData.success) {
		const { fieldErrors } = z.flattenError(parsedData.error);
		console.error(Object.values(fieldErrors).flat());
		return { success: false, errors: Object.values(fieldErrors).flat() };
	}

	const { email, password } = parsedData.data;
	try {
		await auth.api.signInEmail({
			body: { email, password },
		});
	} catch (error) {
		if (error instanceof APIError) {
			return { success: false, errors: error.message };
		}
		console.error('Unexpected signin error', error);
		return {
			success: false,
			errors: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.',
		};
	}

	return { success: true };
}

export async function signInWithDiscord() {
	try {
		const result = await auth.api.signInSocial({
			body: {
				provider: 'discord',
				callbackURL: '/?login=success',
			},
			headers: await headers(),
		});

		if (!result?.url) {
			return {
				success: false,
				errors: 'Nie udało się wygenerować adresu logowania Discord.',
			};
		}

		return { success: true, url: result.url };
	} catch (error) {
		if (error instanceof APIError) {
			return { success: false, errors: error.message };
		}

		console.error('Unexpected sign in with Discord error', error);

		return {
			success: false,
			errors: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.',
		};
	}
}

export async function signout() {
	try {
		await auth.api.signOut({
			headers: await headers(),
		});
	} catch (error) {
		if (error instanceof APIError) {
			return { success: false, errors: error.message };
		}

		console.error('Unexpected signout error', error);

		return {
			success: false,
			errors: 'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.',
		};
	}

	return { success: true };
}
