import {
	columnFilteringFeature,
	createFilteredRowModel,
	createSortedRowModel,
	metaHelper,
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
	filteredRowModel: createFilteredRowModel(),
	sortedRowModel: createSortedRowModel(),
});
