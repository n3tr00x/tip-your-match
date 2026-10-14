import {
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
	rowSortingFeature,
	sortedRowModel: createSortedRowModel(),
});
