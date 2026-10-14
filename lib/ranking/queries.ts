import { prisma } from '@/lib/prisma';
import { POINTS } from '@/lib/predictions/scoring';

export type RankingEntry = {
	userId: string;
	name: string;
	rounds: number;
	predictions: number;
	averagePerRound: number;
	exactHits: number;
	points: number;
	position: number;
};

type RankingRow = Omit<RankingEntry, 'averagePerRound'>;

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

	return rows.map(row => ({
		...row,
		averagePerRound: row.rounds > 0 ? row.points / row.rounds : 0,
	}));
}
