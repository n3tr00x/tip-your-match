import 'server-only';

import { prisma } from '@/lib/prisma';
import { POINTS } from '@/lib/predictions/scoring';
import type { RankingEntry } from '@/lib/ranking/types';

type RankingRow = Omit<RankingEntry, 'averagePerRound'>;

function toRankingEntries(rows: RankingRow[]): RankingEntry[] {
	return rows.map(row => ({
		...row,
		averagePerRound: row.rounds > 0 ? row.points / row.rounds : 0,
	}));
}

export async function getRanking(seasonYear: number): Promise<RankingEntry[]> {
	const rows = await prisma.$queryRaw<RankingRow[]>`
		SELECT
			u.id AS "userId",
			u.name,
			COUNT(DISTINCT f.round)::int AS rounds,
			COUNT(*)::int AS predictions,
			COUNT(*) FILTER (WHERE p.points = ${POINTS.EXACT})::int AS "exactHits",
			SUM(p.points)::int AS points,
			RANK() OVER (
				ORDER BY SUM(p.points) DESC,
					COUNT(*) FILTER (WHERE p.points = ${POINTS.EXACT}) DESC
			)::int AS position
		FROM prediction p
		JOIN fixture f ON f.id = p."fixtureId"
		JOIN season s ON s.id = f."seasonId"
		JOIN "user" u ON u.id = p."userId"
		WHERE p.points IS NOT NULL
			AND s.year = ${seasonYear}
		GROUP BY u.id, u.name
		ORDER BY position, u.name
	`;

	return toRankingEntries(rows);
}

export async function getLeagueRanking(
	leagueId: string,
): Promise<RankingEntry[]> {
	const rows = await prisma.$queryRaw<RankingRow[]>`
    SELECT 
      u.id AS "userId",
      u.name
      COUNT(DISTINCT scored.round)::int AS rounds,
      COUNT(scored.id)::int as predictions,
      COUNT(scored.id) FILTER (WHERE scored.points = ${POINTS.EXACT})::int AS "exactHits",
      COALESCE(SUM(scored.points), 0)::int AS points
      RANK() OVER (
        ORDER BY COALESCE(SUM(scored.points), 0) DESC,
                 COUNT(scored.id) FILTER (WHERE scored.points = ${POINTS.EXACT}) DESC
      )::int AS position
    FROM league_member lm
    JOIN league l ON l.id = lm."leagueId"
    JOIN "user" u ON u.id = lm."userId"
    LEFT JOIN (
      SELECT p.id, p."userId", p.points, f.round, f."seasonId"
      FROM prediction p
      JOIN fixture f ON f.id = p."fixtureId"
      WHERE p.points IS NOT NULL
    ) scored
      ON scored."userId" = lm."userId"
      AND scored."seasonId" = l."seasonId"
      AND scored.round >= lm."joinedRound"
    WHERE lm."leagueId" = ${leagueId}
    GROUP BY u.id, u.name
    ORDER BY position, u.name
	`;

	return toRankingEntries(rows);
}
