import { describe, expect, it } from 'vitest';

import { getPredictableFixtures } from '@/lib/predictions/rounds';

import { makeFixture } from '@/test/factories';

const now = new Date('2026-03-10T12:00:00Z');
const at = (iso: string) => new Date(iso);

// Round 5 is played on 14-15 March. The median kickoff is computed over every playable
// fixture of the round, so adding a fixture to it shifts the median as well.
const currentRound = [
	makeFixture({ round: 5, kickoff: at('2026-03-14T15:00:00Z') }),
	makeFixture({ round: 5, kickoff: at('2026-03-14T18:00:00Z') }),
	makeFixture({ round: 5, kickoff: at('2026-03-15T15:00:00Z') }),
	makeFixture({ round: 5, kickoff: at('2026-03-15T18:00:00Z') }),
];
const previousRound = [
	makeFixture({ round: 4, kickoff: at('2026-03-07T15:00:00Z'), status: 'FINISHED' }),
	makeFixture({ round: 4, kickoff: at('2026-03-07T18:00:00Z'), status: 'FINISHED' }),
];

describe('getPredictableFixtures', () => {
	it('returns nothing when the current round is unknown', () => {
		expect(getPredictableFixtures(currentRound, undefined, now)).toEqual({
			round: undefined,
			moved: [],
			awaitingDate: [],
		});
	});

	it('returns no round when the current round has no fixtures', () => {
		expect(getPredictableFixtures(currentRound, 7, now).round).toBeUndefined();
	});

	it('returns fixtures of the current round played on schedule', () => {
		const nextRound = makeFixture({ round: 6, kickoff: at('2026-03-21T15:00:00Z') });

		const result = getPredictableFixtures([...previousRound, ...currentRound, nextRound], 5, now);

		expect(result.round).toEqual({ round: 5, fixtures: currentRound });
		expect(result.moved).toEqual([]);
		expect(result.awaitingDate).toEqual([]);
	});

	it('moves a fixture brought forward by more than three days out of the round', () => {
		// Median becomes 14 March 18:00, three days and six hours after this kickoff
		const broughtForward = makeFixture({ round: 5, kickoff: at('2026-03-11T12:00:00Z') });

		const result = getPredictableFixtures([...currentRound, broughtForward], 5, now);

		expect(result.round?.fixtures).not.toContain(broughtForward);
		expect(result.moved).toEqual([broughtForward]);
	});

	it('keeps a fixture exactly three days from the median in the round', () => {
		// Median becomes 14 March 18:00, exactly three days after this kickoff
		const onTheEdge = makeFixture({ round: 5, kickoff: at('2026-03-11T18:00:00Z') });

		const result = getPredictableFixtures([...currentRound, onTheEdge], 5, now);

		expect(result.round?.fixtures).toContain(onTheEdge);
		expect(result.moved).toEqual([]);
	});

	it('keeps a fixture within three days of the median in the round', () => {
		const slightlyMoved = makeFixture({ round: 5, kickoff: at('2026-03-13T18:00:00Z') });

		const result = getPredictableFixtures([...currentRound, slightlyMoved], 5, now);

		expect(result.round?.fixtures).toContain(slightlyMoved);
		expect(result.moved).toEqual([]);
	});

	it('lists a rescheduled fixture from an earlier round within the next seven days', () => {
		const rescheduled = makeFixture({ round: 4, kickoff: at('2026-03-12T18:00:00Z') });

		const result = getPredictableFixtures([...previousRound, rescheduled, ...currentRound], 5, now);

		expect(result.moved).toEqual([rescheduled]);
	});

	it('hides a rescheduled fixture until it is within seven days', () => {
		const farAway = makeFixture({ round: 4, kickoff: at('2026-03-25T18:00:00Z') });

		const result = getPredictableFixtures([...previousRound, farAway, ...currentRound], 5, now);

		expect(result.moved).toEqual([]);
	});

	it('does not list a moved fixture that is already locked', () => {
		const locked = makeFixture({ round: 4, kickoff: at('2026-03-10T12:03:00Z') });

		const result = getPredictableFixtures([...previousRound, locked, ...currentRound], 5, now);

		expect(result.moved).toEqual([]);
	});

	it('lists postponed fixtures of the current and earlier rounds as awaiting a date', () => {
		const postponedEarlier = makeFixture({ round: 3, status: 'POSTPONED' });
		const postponedCurrent = makeFixture({ round: 5, status: 'POSTPONED' });
		const postponedLater = makeFixture({ round: 6, status: 'POSTPONED' });

		const result = getPredictableFixtures(
			[postponedEarlier, ...currentRound, postponedCurrent, postponedLater],
			5,
			now,
		);

		expect(result.awaitingDate).toEqual([postponedEarlier, postponedCurrent]);
		expect(result.round?.fixtures).not.toContain(postponedCurrent);
	});
});
