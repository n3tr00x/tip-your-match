import { describe, expect, it } from 'vitest';

import { hasFixtureChanged, type SyncedFixtureFields } from '@/lib/football-api/fixture-changes';

const existing: SyncedFixtureFields = {
	round: 25,
	kickoff: new Date('2026-03-14T18:00:00Z'),
	status: 'SCHEDULED',
	homeTeam: 'Lech Poznań',
	awayTeam: 'Legia Warszawa',
	homeTeamLogo: 'https://crests.test/lech.png',
	awayTeamLogo: 'https://crests.test/legia.png',
	homeScore: null,
	awayScore: null,
};

describe('hasFixtureChanged', () => {
	it('returns false for identical data', () => {
		expect(hasFixtureChanged(existing, { ...existing })).toBe(false);
	});

	it('compares kickoffs by time, not by reference or format', () => {
		const incoming = { ...existing, kickoff: '2026-03-14T19:00:00+01:00' };

		expect(hasFixtureChanged(existing, incoming)).toBe(false);
	});

	it('treats a missing score the same as a null score', () => {
		const incoming = { ...existing, homeScore: undefined, awayScore: undefined };

		expect(hasFixtureChanged(existing, incoming)).toBe(false);
	});

	it.each([
		{ field: 'round', value: 26 },
		{ field: 'kickoff', value: new Date('2026-03-15T18:00:00Z') },
		{ field: 'status', value: 'LIVE' },
		{ field: 'homeTeam', value: 'Lech' },
		{ field: 'awayTeam', value: 'Legia' },
		{ field: 'homeTeamLogo', value: 'https://crests.test/lech-new.png' },
		{ field: 'awayTeamLogo', value: 'https://crests.test/legia-new.png' },
		{ field: 'homeScore', value: 0 },
		{ field: 'awayScore', value: 0 },
	] as const)('detects a change of $field', ({ field, value }) => {
		expect(hasFixtureChanged(existing, { ...existing, [field]: value })).toBe(true);
	});
});
