export type FootballDataMatchStatus =
	| 'SCHEDULED'
	| 'TIMED'
	| 'PAUSED'
	| 'IN_PLAY'
	| 'FINISHED'
	| 'AWARDED'
	| 'POSTPONED'
	| 'SUSPENDED'
	| 'CANCELLED';

export type FootballDataMatch = {
	id: number;
	utcDate: string;
	status: FootballDataMatchStatus;
	matchday: number;
	homeTeam: { name: string; shortName: string; crest: string };
	awayTeam: { name: string; shortName: string; crest: string };
	score: {
		fullTime: { home: number | null; away: number | null };
		halfTime: { home: number | null; away: number | null };
	};
};

export type FootballDataMatchesResponse = {
	resultSet: {
		count: number;
		first: string;
		last: string;
		played: number;
	};
	competition: {
		id: number;
		name: string;
		code: string;
		type: string;
		emblem: string;
	};
	matches: FootballDataMatch[];
};
