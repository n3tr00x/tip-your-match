import { ClockIcon, LockIcon } from 'lucide-react';

import { Fixture } from '@/app/generated/prisma/client';
import { formatMatchDate } from '@/lib/date';
import { STATUS_LABELS } from '@/lib/fixture-status';
import { getPredictionDeadline } from '@/lib/predictions/rules';

type LockStatusProps = {
	fixture: Pick<Fixture, 'kickoff' | 'status'>;
	isOpen: boolean;
};

export function LockStatus({ fixture, isOpen }: LockStatusProps) {
	if (isOpen) {
		const { time } = formatMatchDate(getPredictionDeadline(fixture.kickoff));

		return (
			<>
				<ClockIcon className="size-3" />
				Do {time}
			</>
		);
	}

	if (fixture.status === 'SCHEDULED') {
		return (
			<>
				<LockIcon className="size-3" />
				Zamknięte
			</>
		);
	}

	return STATUS_LABELS[fixture.status];
}
