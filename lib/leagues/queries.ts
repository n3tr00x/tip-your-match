import 'server-only';
import { cache } from 'react';
import { prisma } from '@/lib/prisma';
import { getSeasonFixtures } from '@/lib/schedule/queries';
import { resolveCurrentRound } from '@/lib/schedule/rounds';
import type { LeagueDetails, LeagueSummary } from '@/lib/leagues/types';
import { requireEnvVariable } from '@/lib/utils';

export async function getCurrentSeasonRound(now = new Date()) {
	const seasonYear = Number(requireEnvVariable('FOOTBALL_API_SEASON'));
	const { seasonId, fixtures, currentMatchday } = await getSeasonFixtures(
		seasonYear,
		now,
	);

	const round = resolveCurrentRound(fixtures, currentMatchday, now);

	if (!seasonId || round === undefined) {
		return null;
	}

	return { seasonId, round };
}

export async function getCurrentSeasonId() {
	const seasonYear = Number(requireEnvVariable('FOOTBALL_API_SEASON'));
	const season = await prisma.season.findUnique({
		where: { year: seasonYear },
		select: { id: true },
	});

	return season?.id ?? null;
}

export async function countCreatedLeagues(userId: string, seasonId: string) {
	return prisma.league.count({ where: { adminId: userId, seasonId } });
}

export async function getUserLeagues(
	userId: string,
	seasonId: string,
): Promise<LeagueSummary[]> {
	const leagues = await prisma.league.findMany({
		where: { seasonId, members: { some: { userId } } },
		select: {
			id: true,
			name: true,
			adminId: true,
			_count: { select: { members: true } },
		},
		orderBy: { createdAt: 'asc' },
	});

	return leagues.map(({ adminId, _count, ...league }) => ({
		...league,
		memberCount: _count.members,
		isAdmin: adminId === userId,
	}));
}

// Cached per request: the league page and its generateMetadata both read it
export const getLeagueForMember = cache(async function getLeagueForMember(
	leagueId: string,
	userId: string,
): Promise<LeagueDetails | null> {
	const league = await prisma.league.findFirst({
		where: { id: leagueId, members: { some: { userId } } },
		select: {
			id: true,
			name: true,
			code: true,
			seasonId: true,
			adminId: true,
			members: {
				select: {
					joinedAt: true,
					joinedRound: true,
					user: { select: { id: true, name: true } },
				},
				orderBy: { joinedAt: 'asc' },
			},
		},
	});

	if (!league) {
		return null;
	}

	const { adminId, members, ...details } = league;

	return {
		...details,
		isAdmin: adminId === userId,
		members: members.map(({ user, ...member }) => ({
			...member,
			userId: user.id,
			name: user.name,
			isAdmin: user.id === adminId,
		})),
	};
});
