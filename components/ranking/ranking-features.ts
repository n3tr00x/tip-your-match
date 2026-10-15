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

type RankingColumnMeta = {
	className?: string;
};

export const rankingFeatures = tableFeatures({
	columnMeta: metaHelper<RankingColumnMeta>(),
	columnFilteringFeature,
	rowSortingFeature,
	rowPaginationFeature,
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
	paginatedRowModel: createPaginatedRowModel(),
});
