import * as z from 'zod';
import { PROFILE_LIMITS } from './rules';

export const profileSchema = z.object({
	name: z
		.string('Podaj nazwę')
		.trim()
		.min(
			PROFILE_LIMITS.NAME_MIN,
			`Nazwa musi mieć co najmniej ${PROFILE_LIMITS.NAME_MIN} znaki`,
		)
		.max(
			PROFILE_LIMITS.NAME_MAX,
			`Nazwa może mieć maksymalnie ${PROFILE_LIMITS.NAME_MAX} znaków`,
		),
	bio: z
		.string('Nieprawidłowy opis')
		.trim()
		.max(
			PROFILE_LIMITS.BIO_MAX,
			`Opis może mieć maksymalnie ${PROFILE_LIMITS.BIO_MAX} znaków`,
		)
		.transform(bio => bio || null)
		.nullable(),
});
