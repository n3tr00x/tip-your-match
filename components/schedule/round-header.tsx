import { ClockAlertIcon } from 'lucide-react';

import { formatDateRange } from '@/lib/date';
import { getRoundSummary, type Round, type RoundState } from '@/lib/schedule/rounds';
import { cn } from '@/lib/utils';

import { Badge } from '@/components/ui/badge';

type RoundHeaderProps = {
	round: Round;
	state: RoundState;
};

export function RoundHeader({ round, state }: RoundHeaderProps) {
	const { firstKickoff, lastKickoff, finishedCount, totalFixtures } = getRoundSummary(round);

	return (
		<div
			className={cn(
				'flex flex-1 items-center justify-between gap-4',
				state === 'finished' && 'text-muted-foreground',
			)}
		>
			<div className="flex items-center gap-2">
				<span className="font-heading tracking-widest uppercase tabular-nums">
					Kolejka {round.round}
				</span>
				{state === 'current' && (
					<Badge className="bg-primary px-1.5 py-0.5 text-primary-foreground">Aktualna</Badge>
				)}
				{state === 'pending' && (
					<Badge className="border border-primary px-1.5 py-0.5 text-foreground">
						<ClockAlertIcon />
						Zaległa
					</Badge>
				)}
			</div>

			<div className="flex items-center gap-4 text-xs font-normal text-muted-foreground tabular-nums">
				<span className="hidden sm:inline">{formatDateRange(firstKickoff, lastKickoff)}</span>
				<span>
					{finishedCount}/{totalFixtures}
					<span className="sr-only"> rozegranych meczów</span>
				</span>
			</div>
		</div>
	);
}
