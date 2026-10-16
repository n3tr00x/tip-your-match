import { randomInt } from 'node:crypto';

const CODE_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ23456789';
const CODE_LENGTH = 6;

export function generateLeagueCode() {
	return Array.from(
		{ length: CODE_LENGTH },
		() => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)],
	).join('');
}

export function normalizeLeagueCode(code: string) {
	return code.replace(/\s+/g, '').toUpperCase();
}
