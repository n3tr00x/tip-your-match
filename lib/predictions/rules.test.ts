import { describe, expect, it } from 'vitest';

import { getPredictionDeadline, isFixtureOpenForPrediction } from '@/lib/predictions/rules';

const kickoff = new Date('2026-03-14T18:00:00Z');
const deadline = new Date('2026-03-14T17:55:00Z');
const minutes = (value: number) => value * 60 * 1000;

describe('getPredictionDeadline', () => {
	it('locks predictions five minutes before kickoff', () => {
		expect(getPredictionDeadline(kickoff)).toEqual(deadline);
	});

	it('does not mutate the kickoff date', () => {
		const original = new Date(kickoff);

		getPredictionDeadline(kickoff);

		expect(kickoff).toEqual(original);
	});
});

describe('isFixtureOpenForPrediction', () => {
	const scheduled = { kickoff, status: 'SCHEDULED' as const };

	it('is open for a scheduled fixture well before the deadline', () => {
		const now = new Date(deadline.getTime() - minutes(60));

		expect(isFixtureOpenForPrediction(scheduled, now)).toBe(true);
	});

	it('is open one millisecond before the deadline', () => {
		const now = new Date(deadline.getTime() - 1);

		expect(isFixtureOpenForPrediction(scheduled, now)).toBe(true);
	});

	it('is closed exactly at the deadline', () => {
		expect(isFixtureOpenForPrediction(scheduled, deadline)).toBe(false);
	});

	it('is closed between the deadline and kickoff', () => {
		const now = new Date(deadline.getTime() + minutes(2));

		expect(isFixtureOpenForPrediction(scheduled, now)).toBe(false);
	});

	it.each(['LIVE', 'FINISHED', 'POSTPONED', 'CANCELLED'] as const)(
		'is closed for a %s fixture even before the deadline',
		(status) => {
			const now = new Date(deadline.getTime() - minutes(60));

			expect(isFixtureOpenForPrediction({ kickoff, status }, now)).toBe(false);
		},
	);
});
