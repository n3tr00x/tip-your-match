'use client';

import { RankingEntry } from '@/lib/ranking/queries';

type RankingTableProps = {
	data: RankingEntry[];
	currentUserId: string;
};

export function RankingTable({ data, currentUserId }: RankingTableProps) {
	return <pre>{JSON.stringify({ currentUserId, data }, null, 2)}</pre>;
}
