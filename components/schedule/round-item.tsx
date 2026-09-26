import {
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { FixtureCard } from '@/components/schedule/fixture-card';
import { RoundHeader } from '@/components/schedule/round-header';
import type { Round, RoundState } from '@/lib/schedule';
import { cn } from '@/lib/utils';

export function RoundItem({
	round,
	state,
}: {
	round: Round;
	state: RoundState;
}) {
	return (
		<AccordionItem key={round.round} value={round.round}>
			<AccordionTrigger
				className={cn(
					'items-center px-4 hover:bg-muted/50 hover:no-underline aria-expanded:bg-muted/30',
					state === 'current' && 'border-l-2 border-l-primary',
				)}
			>
				<RoundHeader round={round} state={state} />
			</AccordionTrigger>
			<AccordionContent>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 my-4">
					{round.fixtures.map(fixture => (
						<FixtureCard key={fixture.id} fixture={fixture} />
					))}
				</div>
			</AccordionContent>
		</AccordionItem>
	);
}
