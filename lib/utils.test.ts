import { afterEach, describe, expect, it } from 'vitest';

import { requireEnvVariable } from '@/lib/utils';

const NAME = 'TEST_REQUIRED_VARIABLE';

describe('requireEnvVariable', () => {
	afterEach(() => {
		delete process.env[NAME];
	});

	it('returns the value of a set variable', () => {
		process.env[NAME] = 'secret';

		expect(requireEnvVariable(NAME)).toBe('secret');
	});

	it('throws for a missing variable', () => {
		expect(() => requireEnvVariable(NAME)).toThrow(`Environment variable ${NAME} is required`);
	});

	it('throws for an empty variable', () => {
		process.env[NAME] = '';

		expect(() => requireEnvVariable(NAME)).toThrow(`Environment variable ${NAME} is required`);
	});
});
