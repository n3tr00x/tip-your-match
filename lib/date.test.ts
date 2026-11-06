import { describe, expect, it } from 'vitest';

import { formatDateRange, formatMatchDate, formatMonthYear } from '@/lib/date';

// All dates are UTC; the formatters must render them in Europe/Warsaw time
describe('formatMatchDate', () => {
	it('formats the weekday, date and kickoff time', () => {
		expect(formatMatchDate(new Date('2026-03-14T18:00:00Z'))).toEqual({
			date: 'SOB 14.03',
			time: '19:00',
		});
	});

	it('strips the dot and uppercases Polish weekday abbreviations', () => {
		expect(formatMatchDate(new Date('2026-03-18T18:00:00Z')).date).toBe('ŚR 18.03');
	});

	it('uses summer time (UTC+2) after the clock change', () => {
		expect(formatMatchDate(new Date('2026-07-01T16:00:00Z')).time).toBe('18:00');
	});

	it('moves a late UTC kickoff to the next day in Poland', () => {
		expect(formatMatchDate(new Date('2026-03-14T23:30:00Z'))).toEqual({
			date: 'NIEDZ 15.03',
			time: '00:30',
		});
	});

	it.each([
		{ type: 'an ISO string', input: '2026-03-14T18:00:00Z' },
		{ type: 'a timestamp', input: Date.parse('2026-03-14T18:00:00Z') },
	])('accepts $type', ({ input }) => {
		expect(formatMatchDate(input)).toEqual({ date: 'SOB 14.03', time: '19:00' });
	});
});

describe('formatDateRange', () => {
	it('shows a single date when both kickoffs are on the same day', () => {
		const from = new Date('2026-03-14T12:00:00Z');
		const to = new Date('2026-03-14T20:00:00Z');

		expect(formatDateRange(from, to)).toBe('14.03');
	});

	it('shows a range when kickoffs are on different days', () => {
		const from = new Date('2026-03-14T15:00:00Z');
		const to = new Date('2026-03-16T19:00:00Z');

		expect(formatDateRange(from, to)).toBe('14.03 – 16.03');
	});

	it('compares days in Polish time, not UTC', () => {
		const from = new Date('2026-03-14T20:00:00Z');
		const to = new Date('2026-03-14T23:30:00Z');

		expect(formatDateRange(from, to)).toBe('14.03 – 15.03');
	});
});

describe('formatMonthYear', () => {
	it('formats the month name and year', () => {
		expect(formatMonthYear(new Date('2026-03-01T12:00:00Z'))).toBe('marzec 2026');
	});

	it('picks the month in Polish time around midnight', () => {
		expect(formatMonthYear('2025-12-31T23:30:00Z')).toBe('styczeń 2026');
	});
});
