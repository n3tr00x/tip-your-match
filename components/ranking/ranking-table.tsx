'use client';

import { useTable, type SortDirection } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { RankingPagination } from '@/components/ranking/ranking-pagination';
import { SortIndicator } from '@/components/ranking/sort-indicator';
import { cn } from '@/lib/utils';
import type { RankingEntry } from '@/lib/ranking/types';

type RankingTableProps = {
	data: RankingEntry[];
	currentUserId: string;
};

const PAGE_SIZE = 20;

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
		initialState: {
			sorting: [{ id: 'position', desc: false }],
			pagination: { pageIndex: 0, pageSize: PAGE_SIZE },
		},
		meta: {
			currentUserId,
		},
		enableSortingRemoval: false,
	});

	const nameColumn = table.getColumn('name');
	const filterValue = nameColumn?.getFilterValue();
	const search = typeof filterValue === 'string' ? filterValue : '';
	const rows = table.getRowModel().rows;
	const { pageIndex, pageSize } = table.state.pagination;
	const currentUserIndex = table
		.getPrePaginatedRowModel()
		.rows.findIndex(row => row.original.userId === currentUserId);
	const currentUserPageIndex =
		currentUserIndex !== -1 ? Math.floor(currentUserIndex / pageSize) : null;

	return (
		<div className="space-y-4">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<Input
					aria-label="Szukaj gracza"
					type="search"
					value={search}
					onChange={event => nameColumn?.setFilterValue(event.target.value)}
					placeholder="Szukaj gracza..."
					className="max-w-xs"
				/>
				{currentUserPageIndex !== null && table.getPageCount() > 1 && (
					<Button
						variant="outline"
						size="sm"
						onClick={() => table.setPageIndex(currentUserPageIndex)}
						disabled={currentUserPageIndex === pageIndex}
					>
						Pokaż moją pozycję
					</Button>
				)}
			</div>

			<Table aria-label="Ranking graczy">
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
			<RankingPagination
				pageIndex={pageIndex}
				pageCount={table.getPageCount()}
				canPreviousPage={table.getCanPreviousPage()}
				canNextPage={table.getCanNextPage()}
				onPreviousPage={table.previousPage}
				onNextPage={table.nextPage}
			/>
		</div>
	);
}
