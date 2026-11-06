import type { FixtureUncheckedCreateInput } from '@/app/generated/prisma/models';

export type SyncedFixtureFields = Pick<
	FixtureUncheckedCreateInput,
	| 'round'
	| 'kickoff'
	| 'status'
	| 'homeTeam'
	| 'awayTeam'
	| 'homeTeamLogo'
	| 'awayTeamLogo'
	| 'homeScore'
	| 'awayScore'
>;

export function hasFixtureChanged(existing: SyncedFixtureFields, incoming: SyncedFixtureFields) {
	return (
		existing.round !== incoming.round ||
		new Date(existing.kickoff).getTime() !== new Date(incoming.kickoff).getTime() ||
		existing.status !== incoming.status ||
		existing.homeTeam !== incoming.homeTeam ||
		existing.awayTeam !== incoming.awayTeam ||
		existing.homeTeamLogo !== incoming.homeTeamLogo ||
		existing.awayTeamLogo !== incoming.awayTeamLogo ||
		(existing.homeScore ?? null) !== (incoming.homeScore ?? null) ||
		(existing.awayScore ?? null) !== (incoming.awayScore ?? null)
	);
}
