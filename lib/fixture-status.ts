import type { FixtureStatus } from '@/app/generated/prisma/enums';

export const STATUS_LABELS: Record<FixtureStatus, string> = {
	SCHEDULED: 'Zaplanowany',
	LIVE: 'Na żywo',
	FINISHED: 'Zakończony',
	POSTPONED: 'Przełożony',
	CANCELLED: 'Odwołany',
};
