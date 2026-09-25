export type MatchOutcome = 'home' | 'away' | 'draw';

type Score = {
	homeScore: number | null;
	awayScore: number | null;
};

export function getMatchOutcome({
	homeScore,
	awayScore,
}: Score): MatchOutcome | null {
	if (homeScore === null || awayScore === null) {
		return null;
	}

	if (homeScore > awayScore) {
		return 'home';
	}

	if (awayScore > homeScore) {
		return 'away';
	}

	return 'draw';
}
