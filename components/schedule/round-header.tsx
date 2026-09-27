import { ClockAlertIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getRoundSummary, type Round, type RoundState } from '@/lib/schedule';
import { cn, formatDateRange } from '@/lib/utils';

type RoundHeaderProps = {
	round: Round;
	state: RoundState;
};

export function RoundHeader({ round, state }: RoundHeaderProps) {
	const { firstKickoff, lastKickoff, finishedCount, totalFixtures } =
		getRoundSummary(round);

	return (
		<div
			className={cn(
				'flex flex-1 items-center justify-between gap-4',
				state === 'finished' && 'text-muted-foreground',
			)}
		>
			<div className="flex items-center gap-2">
				<span className="font-heading uppercase tracking-widest tabular-nums">
					Kolejka {round.round}
				</span>
				{state === 'current' && (
					<Badge className="bg-primary text-primary-foreground px-1.5 py-0.5">
						Aktualna
					</Badge>
				)}
				{state === 'pending' && (
					<Badge className="border border-primary text-foreground px-1.5 py-0.5">
						<ClockAlertIcon />
						Zaległa
					</Badge>
				)}
			</div>

			<div className="flex items-center gap-4 text-xs font-normal text-muted-foreground tabular-nums">
				<span className="hidden sm:inline">
					{formatDateRange(firstKickoff, lastKickoff)}
				</span>
				<span>
					{finishedCount}/{totalFixtures}
					<span className="sr-only"> rozegranych meczów</span>
				</span>
			</div>
		</div>
	);
}
