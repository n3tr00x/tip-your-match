'use client';

import { useTable, type SortDirection } from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { rankingColumns } from '@/components/ranking/ranking-columns';
import { rankingFeatures } from '@/components/ranking/ranking-features';
import { SortIndicator } from '@/components/ranking/sort-indicator';
import { cn } from '@/lib/utils';
import type { RankingEntry } from '@/lib/ranking/queries';
import { Input } from '../ui/input';

type RankingTableProps = {
	data: RankingEntry[];
	currentUserId: string;
};

const ARIA_SORT = {
	asc: 'ascending',
	desc: 'descending',
} as const satisfies Record<SortDirection, string>;

export function RankingTable({ data, currentUserId }: RankingTableProps) {
	const table = useTable({
		features: rankingFeatures,
		columns: rankingColumns,
		data,
		getRowId: row => row.userId,
		initialState: { sorting: [{ id: 'position', desc: false }] },
		enableSortingRemoval: true,
	});

	const nameColumn = table.getColumn('name');
	const filterValue = nameColumn?.getFilterValue();
	const search = typeof filterValue === 'string' ? filterValue : '';
	const rows = table.getRowModel().rows;

	return (
		<div className="space-y-4">
			<Input
				aria-label="Szukaj gracza"
				type="search"
				value={search}
				onChange={event => nameColumn?.setFilterValue(event.target.value)}
				placeholder="Szukaj gracza..."
				className="max-w-xs"
			/>

			<Table>
				<TableHeader>
					{table.getHeaderGroups().map(headerGroup => (
						<TableRow key={headerGroup.id}>
							{headerGroup.headers.map(header => {
								const direction = header.column.getIsSorted();

								return (
									<TableHead
										key={header.id}
										className={header.column.columnDef.meta?.className}
										aria-sort={direction ? ARIA_SORT[direction] : undefined}
									>
										{header.isPlaceholder ? null : (
											<button
												type="button"
												onClick={header.column.getToggleSortingHandler()}
												className="inline-flex items-center gap-1 hover:text-foreground"
											>
												<table.FlexRender header={header} />
												<SortIndicator direction={direction} />
											</button>
										)}
									</TableHead>
								);
							})}
						</TableRow>
					))}
				</TableHeader>
				<TableBody>
					{rows.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={rankingColumns.length}
								className="py-8 text-center text-muted-foreground"
							>
								Nie znaleziono gracza &quot;{search}&quot;
							</TableCell>
						</TableRow>
					) : (
						rows.map(row => (
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
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
