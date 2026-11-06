import type { Fixture } from '@/app/generated/prisma/client';

import type { RankingEntry } from '@/lib/ranking/types';

const DEFAULT_DATE = new Date('2026-01-10T15:00:00Z');

let nextId = 1;

export function makeFixture(overrides: Partial<Fixture> = {}): Fixture {
	const id = nextId++;

	return {
		id: `fixture-${id}`,
		apiId: id,
		seasonId: 'season-1',
		round: 1,
		kickoff: DEFAULT_DATE,
		status: 'SCHEDULED',
		homeTeam: `Home ${id}`,
		homeTeamLogo: `https://crests.test/home-${id}.png`,
		awayTeam: `Away ${id}`,
		awayTeamLogo: `https://crests.test/away-${id}.png`,
		homeScore: null,
		awayScore: null,
		createdAt: DEFAULT_DATE,
		updatedAt: DEFAULT_DATE,
		...overrides,
	};
}

export function makeRankingEntry(overrides: Partial<RankingEntry> = {}): RankingEntry {
	const id = nextId++;

	return {
		userId: `user-${id}`,
		name: `Gracz ${id}`,
		rounds: 1,
		predictions: 10,
		averagePerRound: 10,
		exactHits: 1,
		points: 10,
		position: 1,
		...overrides,
	};
}
