import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from '@/components/ui/accordion';
import { RoundItem } from '@/components/schedule/round-item';
import { type Round } from '@/lib/schedule';

export type FinishedRoundsProps = {
	finishedRounds: Round[];
};

export function FinishedRounds({ finishedRounds }: FinishedRoundsProps) {
	if (!finishedRounds || finishedRounds.length === 0) {
		return null;
	}

	return (
		<Accordion>
			<AccordionItem value="finished">
				<AccordionTrigger>
					Zakończone kolejki ({finishedRounds.length})
				</AccordionTrigger>
				<AccordionContent>
					<Accordion>
						{finishedRounds.map(round => (
							<RoundItem key={round.round} round={round} state="finished" />
						))}
					</Accordion>
					{/* <RoundAccordion rounds={finishedRounds} currentRound={currentRound} /> */}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
