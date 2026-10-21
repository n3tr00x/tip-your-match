'use server';

import { redirect } from 'next/navigation';
import * as z from 'zod';
import { Prisma } from '@/app/generated/prisma/client';
import { prisma } from '@/lib/prisma';
import { requireSession } from '@/lib/session';
import { generateLeagueCode, normalizeLeagueCode } from '@/lib/leagues/code';
import { CODE_LENGTH, LEAGUE_LIMITS } from '@/lib/leagues/rules';
import {
	countCreatedLeagues,
	getCurrentSeasonRound,
} from '@/lib/leagues/queries';

const MAX_CODE_ATTEMPTS = 3;
const UNEXPECTED_ERROR =
	'Wystąpił nieoczekiwany błąd. Spróbuj ponownie później.';
const SEASON_UNAVAILABLE_ERROR =
	'Sezon nie jest jeszcze dostępny. Spróbuj ponownie później.';

const leagueNameSchema = z
	.string('Podaj nazwę ligi')
	.trim()
	.min(3, 'Nazwa ligi musi mieć co najmniej 3 znaki')
	.max(40, 'Nazwa ligi nie może mieć więcej niż 40 znaków');

const leagueCodeSchema = z
	.string('Podaj kod ligi')
	.transform(normalizeLeagueCode)
	.pipe(
		z
			.string()
			.length(CODE_LENGTH, `Kod ligi składa się z ${CODE_LENGTH} znaków`),
	);

const leagueIdSchema = z
	.string('Nieprawidłowa liga')
	.min(1, 'Nieprawidłowa liga');

export type LeagueFormState = {
	success: boolean;
	errors?: string[];
	value?: string;
};

function getErrorMessages(error: z.ZodError) {
	return error.issues.map(issue => issue.message);
}

function isUniqueConstraintError(error: unknown) {
	return (
		error instanceof Prisma.PrismaClientKnownRequestError &&
		error.code === 'P2002'
	);
}

async function createLeagueWithUniqueCode(data: {
	name: string;
	userId: string;
	seasonId: string;
	round: number;
}) {
	for (let attempt = 1; ; attempt++) {
		try {
			const league = await prisma.league.create({
				data: {
					name: data.name,
					code: generateLeagueCode(),
					adminId: data.userId,
					seasonId: data.seasonId,
					members: { create: { userId: data.userId, joinedRound: data.round } },
				},
				select: { id: true },
			});

			return league.id;
		} catch (error) {
			if (!isUniqueConstraintError(error) || attempt >= MAX_CODE_ATTEMPTS) {
				throw error;
			}
		}
	}
}

export async function createLeague(
	_previousState: LeagueFormState,
	formData: FormData,
): Promise<LeagueFormState> {
	const session = await requireSession();
	const userId = session.user.id;

	const rawName = formData.get('name');
	const value = String(rawName ?? '');
	const parsedName = leagueNameSchema.safeParse(value);

	if (!parsedName.success) {
		return {
			success: false,
			errors: getErrorMessages(parsedName.error),
			value,
		};
	}

	let leagueId: string;

	try {
		const current = await getCurrentSeasonRound();

		if (!current) {
			return { success: false, errors: [SEASON_UNAVAILABLE_ERROR], value };
		}

		const createdCount = await countCreatedLeagues(userId, current.seasonId);

		if (createdCount >= LEAGUE_LIMITS.MAX_CREATED) {
			return {
				success: false,
				errors: [
					`Możesz utworzyć maksymalnie ${LEAGUE_LIMITS.MAX_CREATED} lig w sezonie.`,
				],
				value,
			};
		}

		leagueId = await createLeagueWithUniqueCode({
			name: parsedName.data,
			userId,
			seasonId: current.seasonId,
			round: current.round,
		});
	} catch (error) {
		console.error('Unexpected error while creating league:', error);
		return { success: false, errors: [UNEXPECTED_ERROR], value };
	}

	redirect(`/leagues/${leagueId}`);
}

export async function joinLeague(
	_previousState: LeagueFormState,
	formData: FormData,
): Promise<LeagueFormState> {
	const session = await requireSession();
	const userId = session.user.id;

	const rawCode = formData.get('code');
	const value = String(rawCode ?? '');
	const parsedCode = leagueCodeSchema.safeParse(formData.get('code'));

	if (!parsedCode.success) {
		return {
			success: false,
			errors: getErrorMessages(parsedCode.error),
			value,
		};
	}

	let leagueId: string;

	try {
		const current = await getCurrentSeasonRound();

		if (!current) {
			return { success: false, errors: [SEASON_UNAVAILABLE_ERROR], value };
		}

		const league = await prisma.league.findUnique({
			where: { code: parsedCode.data },
			select: {
				id: true,
				seasonId: true,
				_count: { select: { members: true } },
				members: { where: { userId }, select: { id: true } },
			},
		});

		if (!league) {
			return {
				success: false,
				errors: ['Nie znaleziono ligi o podanym kodzie'],
				value,
			};
		}

		if (league.members.length > 0) {
			return {
				success: false,
				errors: ['Już należysz do tej ligi'],
				value,
			};
		}

		if (league.seasonId !== current.seasonId) {
			return {
				success: false,
				errors: ['Ta liga dotyczy zakończonego sezonu'],
				value,
			};
		}

		if (league._count.members >= LEAGUE_LIMITS.MAX_MEMBERS) {
			return {
				success: false,
				errors: [`Liga osiągnęła limit ${LEAGUE_LIMITS.MAX_MEMBERS} członków`],
				value,
			};
		}

		await prisma.leagueMember.create({
			data: { leagueId: league.id, userId, joinedRound: current.round },
		});

		leagueId = league.id;
	} catch (error) {
		if (isUniqueConstraintError(error)) {
			return { success: false, errors: ['Już należysz do tej ligi'], value };
		}

		console.error('Unexpected error while joining league:', error);
		return { success: false, errors: [UNEXPECTED_ERROR], value };
	}

	redirect(`/leagues/${leagueId}`);
}

export async function leaveLeague(
	_previousState: LeagueFormState,
	formData: FormData,
): Promise<LeagueFormState> {
	const session = await requireSession();
	const userId = session.user.id;

	const parsedLeagueId = leagueIdSchema.safeParse(formData.get('leagueId'));

	if (!parsedLeagueId.success) {
		return { success: false, errors: getErrorMessages(parsedLeagueId.error) };
	}

	const leagueId = parsedLeagueId.data;

	try {
		const { count: deletedLeagues } = await prisma.league.deleteMany({
			where: { id: leagueId, adminId: userId },
		});

		if (deletedLeagues === 0) {
			const { count: deletedMemberships } =
				await prisma.leagueMember.deleteMany({
					where: { leagueId, userId },
				});

			if (deletedMemberships === 0) {
				return { success: false, errors: ['Nie należysz do tej ligi'] };
			}
		}
	} catch (error) {
		console.error('Unexpected error while leaving league:', error);
		return { success: false, errors: [UNEXPECTED_ERROR] };
	}

	redirect(`/leagues`);
}
