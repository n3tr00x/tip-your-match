import { describe, expect, it } from 'vitest';

import { PROFILE_LIMITS } from '@/lib/profile/rules';
import { profileSchema } from '@/lib/profile/schema';

function getErrors(input: unknown) {
	const result = profileSchema.safeParse(input);

	return result.success ? [] : result.error.issues.map((issue) => issue.message);
}

describe('profileSchema', () => {
	it('trims the name and bio', () => {
		expect(profileSchema.parse({ name: '  Jan Kowalski ', bio: ' Kibic Lecha  ' })).toEqual({
			name: 'Jan Kowalski',
			bio: 'Kibic Lecha',
		});
	});

	it.each([
		{ case: 'an empty bio', bio: '' },
		{ case: 'a whitespace-only bio', bio: '   ' },
		{ case: 'a missing bio', bio: null },
	])('stores $case as null', ({ bio }) => {
		expect(profileSchema.parse({ name: 'Jan', bio }).bio).toBeNull();
	});

	it('accepts a name and bio at their maximum length', () => {
		const input = {
			name: 'a'.repeat(PROFILE_LIMITS.NAME_MAX),
			bio: 'b'.repeat(PROFILE_LIMITS.BIO_MAX),
		};

		expect(profileSchema.safeParse(input).success).toBe(true);
	});

	it('requires a name', () => {
		expect(getErrors({ name: null, bio: null })).toEqual(['Podaj nazwę']);
	});

	it('rejects a name that is too short after trimming', () => {
		expect(getErrors({ name: '  a  ', bio: null })).toEqual([
			'Nazwa musi mieć co najmniej 2 znaki',
		]);
	});

	it('rejects a name that is too long', () => {
		const name = 'a'.repeat(PROFILE_LIMITS.NAME_MAX + 1);

		expect(getErrors({ name, bio: null })).toEqual(['Nazwa może mieć maksymalnie 30 znaków']);
	});

	it('rejects a bio that is too long', () => {
		const bio = 'b'.repeat(PROFILE_LIMITS.BIO_MAX + 1);

		expect(getErrors({ name: 'Jan', bio })).toEqual(['Opis może mieć maksymalnie 280 znaków']);
	});

	it('reports problems with both fields at once', () => {
		const bio = 'b'.repeat(PROFILE_LIMITS.BIO_MAX + 1);

		expect(getErrors({ name: 'a', bio })).toHaveLength(2);
	});
});
