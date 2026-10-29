export type RankingEntry = {
	userId: string;
	name: string;
	rounds: number;
	predictions: number;
	averagePerRound: number;
	exactHits: number;
	points: number;
	position: number;
};

export type RankingStanding = {
	position: number;
	points: number;
	totalPlayers: number;
};
