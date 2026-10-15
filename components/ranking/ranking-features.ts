import {
	columnFilteringFeature,
	createFilteredRowModel,
	createPaginatedRowModel,
	createSortedRowModel,
	metaHelper,
	rowPaginationFeature,
	rowSortingFeature,
	tableFeatures,
} from '@tanstack/react-table';

type RankingTableMeta = {
	currentUserId: string;
};

type RankingColumnMeta = {
	className?: string;
};

export const rankingFeatures = tableFeatures({
	tableMeta: metaHelper<RankingTableMeta>(),
	columnMeta: metaHelper<RankingColumnMeta>(),
	columnFilteringFeature,
	rowSortingFeature,
	rowPaginationFeature,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
});
