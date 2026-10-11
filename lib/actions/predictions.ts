'use server';

import { refresh } from 'next/cache';
import * as z from 'zod';

import { prisma } from '@/lib/prisma';
import { isFixtureOpenForPrediction } from '@/lib/predictions/rules';
import { requireSession } from '@/lib/session';

const SCORE_ERROR = 'Wynik musi być liczbą całkowitą od 0 do 20';

const scoreSchema = z
	.string(SCORE_ERROR)
	.trim()
	.min(1, 'Podaj wynik obu drużyn')
	.pipe(
		z.coerce
			.number<string>(SCORE_ERROR)
			.int(SCORE_ERROR)
			.min(0, SCORE_ERROR)
			.max(20, SCORE_ERROR),
	);

const predictionSchema = z.object({
	fixtureId: z.string('Nieprawidłowy mecz').min(1, 'Nieprawidłowy mecz'),
	homeScore: scoreSchema,
	awayScore: scoreSchema,
});

export type PredictionFormState = {
	success: boolean;
	errors?: string[];
	values?: { homeScore: string; awayScore: string };
};

export async function savePrediction(
	_previousState: PredictionFormState,
	formData: FormData,
): Promise<PredictionFormState> {
	const session = await requireSession();

	const raw = {
		fixtureId: formData.get('fixtureId'),
		homeScore: formData.get('homeScore'),
		awayScore: formData.get('awayScore'),
	};
	const values = {
		homeScore: String(raw.homeScore ?? ''),
		awayScore: String(raw.awayScore ?? ''),
	};

	const parsedData = predictionSchema.safeParse(raw);

	if (!parsedData.success) {
		const { fieldErrors } = z.flattenError(parsedData.error);
		const errors = [...new Set(Object.values(fieldErrors).flat())];

		return { success: false, errors, values };
	}

	const { fixtureId, homeScore, awayScore } = parsedData.data;
	const userId = session.user.id;

	try {
		const fixture = await prisma.fixture.findUnique({
			where: { id: fixtureId },
			select: { kickoff: true, status: true },
		});

		if (!fixture) {
			return { success: false, errors: ['Nie znaleziono meczu'], values };
		}

		if (!isFixtureOpenForPrediction(fixture)) {
			return {
				success: false,
				errors: ['Typowanie na ten mecz jest już zamknięte'],
				values,
			};
		}

		await prisma.prediction.upsert({
			where: { userId_fixtureId: { userId, fixtureId } },
			create: { userId, fixtureId, homeScore, awayScore },
			update: { homeScore, awayScore },
		});
	} catch (error) {
		console.error('Unexpected save prediction error', error);

		return {
			success: false,
			errors: ['Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.'],
			values,
		};
	}

	refresh();

	return { success: true, values };
}
