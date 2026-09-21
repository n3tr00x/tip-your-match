export { cn } from 'cn';

export function requireEnvVariable(name: string) {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Environment variable ${name} is required`);
	}
	return value;
}
