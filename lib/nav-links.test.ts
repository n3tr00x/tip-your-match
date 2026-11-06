import { describe, expect, it } from 'vitest';

import { isLinkActive } from '@/lib/nav-links';

describe('isLinkActive', () => {
	it.each([
		{ pathname: '/leagues', href: '/leagues', expected: true },
		{ pathname: '/leagues/abc123', href: '/leagues', expected: true },
		{ pathname: '/', href: '/leagues', expected: false },
		{ pathname: '/ranking', href: '/leagues', expected: false },
		{ pathname: '/leagues-archive', href: '/leagues', expected: false },
	])('returns $expected for $href on $pathname', ({ pathname, href, expected }) => {
		expect(isLinkActive(pathname, href)).toBe(expected);
	});
});
