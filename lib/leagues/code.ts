import { randomInt } from 'node:crypto';
import { CODE_ALPHABET, CODE_LENGTH } from '@/lib/leagues/rules';

export function generateLeagueCode() {
	return Array.from(
		{ length: CODE_LENGTH },
		() => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)],
	).join('');
}

export function normalizeLeagueCode(code: string) {
	return code.replace(/\s+/g, '').toUpperCase();
}
