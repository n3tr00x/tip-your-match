import { RoundItem } from '@/components/schedule/round-item';
import { Accordion } from '@/components/ui/accordion';
import { getRoundState, type Round } from '@/lib/schedule';

type RoundAccordionProps = {
	rounds: Round[];
	currentRound?: string;
};

export function RoundAccordion({ rounds, currentRound }: RoundAccordionProps) {
	return (
		<Accordion defaultValue={currentRound ? [currentRound] : []}>
			{rounds.map(round => {
				return (
					<RoundItem
						key={round.round}
						round={round}
						state={getRoundState(round.round, currentRound)}
					/>
				);
			})}
		</Accordion>
	);
}
