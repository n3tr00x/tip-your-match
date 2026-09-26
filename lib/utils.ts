export { cn } from 'cn';

export function requireEnvVariable(name: string) {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Environment variable ${name} is required`);
	}

	return value;
}

const TIME_ZONE = 'Europe/Warsaw';

const weekdayFormatter = new Intl.DateTimeFormat('pl-PL', {
	weekday: 'short',
	timeZone: TIME_ZONE,
});

const dateFormatter = new Intl.DateTimeFormat('pl-PL', {
	day: '2-digit',
	month: '2-digit',
	timeZone: TIME_ZONE,
});

const timeFormatter = new Intl.DateTimeFormat('pl-PL', {
	hour: '2-digit',
	minute: '2-digit',
	timeZone: TIME_ZONE,
});

export function formatDateRange(from: Date, to: Date) {
	const start = dateFormatter.format(from);
	const end = dateFormatter.format(to);

	return start === end ? start : `${start}–${end}`;
}

export function formatMatchDate(input: Date | string | number) {
	const date = new Date(input);
	const weekday = weekdayFormatter.format(date).replace('.', '').toUpperCase();
	const day = dateFormatter.format(date);
	const time = timeFormatter.format(date);

	return {
		date: `${weekday} ${day}`,
		time,
	};
}
