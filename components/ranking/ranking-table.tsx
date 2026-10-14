'use client';

import { useTable } from '@tanstack/react-table';
import { rankingColumns } from '@/components/ranking/ranking-columns';
import { rankingFeatures } from '@/components/ranking/ranking-features';

import type { RankingEntry } from '@/lib/ranking/queries';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '../ui/table';
import { cn } from '@/lib/utils';

type RankingTableProps = {
	data: RankingEntry[];
	currentUserId: string;
};

export function RankingTable({ data, currentUserId }: RankingTableProps) {
	const table = useTable({
		features: rankingFeatures,
		columns: rankingColumns,
		data,
		getRowId: row => row.userId,
	});

	return (
		<Table>
			<TableHeader>
				{table.getHeaderGroups().map(headerGroup => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map(header => (
							<TableHead
								key={header.id}
								className={header.column.columnDef.meta?.className}
							>
								{header.isPlaceholder ? null : (
									<table.FlexRender header={header} />
								)}
							</TableHead>
						))}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows.map(row => (
					<TableRow
						key={row.id}
						className={cn({
							'bg-primary/5': row.original.userId === currentUserId,
						})}
					>
						{row.getAllCells().map(cell => (
							<TableCell
								key={cell.id}
								className={cell.column.columnDef.meta?.className}
							>
								<table.FlexRender cell={cell} />
							</TableCell>
						))}
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
