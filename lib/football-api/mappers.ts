import { FixtureStatus } from '@/app/generated/prisma/enums';
import { FixtureUncheckedCreateInput } from '@/app/generated/prisma/models';
import {
	FootballDataMatch,
	FootballDataMatchStatus,
} from '@/lib/football-api/types';

function mapStatus(status: FootballDataMatchStatus): FixtureStatus {
	switch (status) {
		case 'SCHEDULED':
		case 'TIMED':
			return 'SCHEDULED';
		case 'IN_PLAY':
		case 'PAUSED':
		case 'PENALTY_SHOOTOUT':
		case 'EXTRA_TIME':
			return 'LIVE';
		case 'FINISHED':
		case 'AWARDED':
			return 'FINISHED';
		case 'POSTPONED':
		case 'SUSPENDED':
			return 'POSTPONED';
		case 'CANCELLED':
			return 'CANCELLED';
		default:
			throw new Error(`Unknown match status: ${status}`);
	}
}

export function mapMatchToFixtureData(
	match: FootballDataMatch,
	seasonId: string,
): FixtureUncheckedCreateInput {
	return {
		apiId: match.id,
		seasonId: seasonId,
		round: match.matchday,
		kickoff: new Date(match.utcDate),
		status: mapStatus(match.status),
		homeTeam: match.homeTeam.name,
		awayTeam: match.awayTeam.name,
		homeTeamLogo: match.homeTeam.crest,
		awayTeamLogo: match.awayTeam.crest,
		homeScore: match.score.fullTime.home,
		awayScore: match.score.fullTime.away,
	};
}
