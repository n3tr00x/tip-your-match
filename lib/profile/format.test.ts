import { describe, expect, it } from 'vitest';

import { getInitials } from '@/lib/profile/format';

describe('getInitials', () => {
	it.each([
		{ name: 'Jan Kowalski', initials: 'JK' },
		{ name: 'jan kowalski', initials: 'JK' },
		{ name: 'Jan', initials: 'J' },
		{ name: 'Jan Maria Rokita', initials: 'JM' },
		{ name: '  Jan    Kowalski  ', initials: 'JK' },
		{ name: 'Łukasz Żak', initials: 'ŁŻ' },
		{ name: 'ćma ślimak', initials: 'ĆŚ' },
	])('returns "$initials" for "$name"', ({ name, initials }) => {
		expect(getInitials(name)).toBe(initials);
	});

	it('keeps an emoji as a whole character', () => {
		expect(getInitials('🦊 Lis')).toBe('🦊L');
	});

	it('returns an empty string for a blank name', () => {
		expect(getInitials('   ')).toBe('');
	});
});
