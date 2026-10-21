export type LeagueSummary = {
	id: string;
	name: string;
	memberCount: number;
	isAdmin: boolean;
};

export type LeagueMemberEntry = {
	userId: string;
	name: string;
	joinedAt: Date;
	joinedRound: number;
	isAdmin: boolean;
};

export type LeagueDetails = {
	id: string;
	name: string;
	code: string;
	seasonId: string;
	isAdmin: boolean;
	members: LeagueMemberEntry[];
};
