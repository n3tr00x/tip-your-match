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
