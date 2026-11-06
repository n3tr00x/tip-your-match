import { describe, expect, it } from 'vitest';

import { mapMatchToFixtureData } from '@/lib/football-api/mappers';
import type { FootballDataMatch, FootballDataMatchStatus } from '@/lib/football-api/types';

function makeMatch(overrides: Partial<FootballDataMatch> = {}): FootballDataMatch {
	return {
		id: 537_785,
		utcDate: '2026-03-14T18:00:00Z',
		status: 'TIMED',
		matchday: 25,
		homeTeam: { name: 'Lech Poznań', shortName: 'Lech', crest: 'https://crests.test/lech.png' },
		awayTeam: {
			name: 'Legia Warszawa',
			shortName: 'Legia',
			crest: 'https://crests.test/legia.png',
		},
		score: {
			fullTime: { home: null, away: null },
			halfTime: { home: null, away: null },
		},
		season: {
			id: 2_401,
			startDate: '2025-07-18',
			endDate: '2026-05-23',
			currentMatchday: 25,
			winner: null,
		},
		...overrides,
	};
}

describe('mapMatchToFixtureData', () => {
	it('maps an API match to fixture data of the given season', () => {
		expect(mapMatchToFixtureData(makeMatch(), 'season-1')).toEqual({
			apiId: 537_785,
			seasonId: 'season-1',
			round: 25,
			kickoff: new Date('2026-03-14T18:00:00Z'),
			status: 'SCHEDULED',
			homeTeam: 'Lech Poznań',
			awayTeam: 'Legia Warszawa',
			homeTeamLogo: 'https://crests.test/lech.png',
			awayTeamLogo: 'https://crests.test/legia.png',
			homeScore: null,
			awayScore: null,
		});
	});

	it('uses the full-time score, not the half-time score', () => {
		const match = makeMatch({
			status: 'FINISHED',
			score: { fullTime: { home: 3, away: 1 }, halfTime: { home: 1, away: 1 } },
		});

		const fixture = mapMatchToFixtureData(match, 'season-1');

		expect(fixture.homeScore).toBe(3);
		expect(fixture.awayScore).toBe(1);
	});

	it.each([
		{ apiStatus: 'SCHEDULED', status: 'SCHEDULED' },
		{ apiStatus: 'TIMED', status: 'SCHEDULED' },
		{ apiStatus: 'IN_PLAY', status: 'LIVE' },
		{ apiStatus: 'PAUSED', status: 'LIVE' },
		{ apiStatus: 'EXTRA_TIME', status: 'LIVE' },
		{ apiStatus: 'PENALTY_SHOOTOUT', status: 'LIVE' },
		{ apiStatus: 'FINISHED', status: 'FINISHED' },
		{ apiStatus: 'AWARDED', status: 'FINISHED' },
		{ apiStatus: 'POSTPONED', status: 'POSTPONED' },
		{ apiStatus: 'SUSPENDED', status: 'POSTPONED' },
		{ apiStatus: 'CANCELLED', status: 'CANCELLED' },
	] as const)('maps the $apiStatus API status to $status', ({ apiStatus, status }) => {
		expect(mapMatchToFixtureData(makeMatch({ status: apiStatus }), 'season-1').status).toBe(status);
	});

	it('throws on a status the app does not know', () => {
		const match = makeMatch({ status: 'ABANDONED' as FootballDataMatchStatus });

		expect(() => mapMatchToFixtureData(match, 'season-1')).toThrow(
			'Unknown match status: ABANDONED',
		);
	});
});
