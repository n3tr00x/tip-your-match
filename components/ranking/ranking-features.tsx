import { metaHelper, tableFeatures } from '@tanstack/react-table';

type RankingColumnMeta = {
	className?: string;
};

export const rankingFeatures = tableFeatures({
	columnMeta: metaHelper<RankingColumnMeta>(),
});
