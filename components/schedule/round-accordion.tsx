import { FixtureCard } from '@/components/schedule/fixture-card';
import { RoundHeader } from '@/components/schedule/round-header';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { getRoundState, type Round } from '@/lib/schedule';
import { cn } from '@/lib/utils';

type RoundAccordionProps = {
	rounds: Round[];
	currentRound?: string;
};

export function RoundAccordion({ rounds, currentRound }: RoundAccordionProps) {
	return (
		<Accordion defaultValue={currentRound ? [currentRound] : []}>
			{rounds.map(round => {
				const state = getRoundState(round.round, currentRound);

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
			})}
		</Accordion>
	);
}
