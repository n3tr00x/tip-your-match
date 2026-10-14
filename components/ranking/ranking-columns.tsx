import { createColumnHelper } from '@tanstack/react-table';

import { rankingFeatures } from '@/components/ranking/ranking-features';
import type { RankingEntry } from '@/lib/ranking/queries';

const columnHelper = createColumnHelper<typeof rankingFeatures, RankingEntry>();
const averageFormatter = new Intl.NumberFormat('pl-PL', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});
const NUMERIC = 'text-right tabular-nums';
const NUMERIC_DESKTOP = `${NUMERIC} hidden sm:table-cell`;

export const rankingColumns = columnHelper.columns([
	columnHelper.accessor('position', {
		header: '#',
		meta: { className: 'w-12 tabular-nums' },
	}),
	columnHelper.accessor('name', {
		header: 'Gracz',
	}),
	columnHelper.accessor('rounds', {
		header: 'Kolejki',
		meta: { className: NUMERIC_DESKTOP },
	}),
	columnHelper.accessor('predictions', {
		header: 'Mecze',
		meta: { className: NUMERIC_DESKTOP },
	}),
	columnHelper.accessor('averagePerRound', {
		header: 'Śr. / kolejkę',
		cell: info => averageFormatter.format(info.getValue()),
		meta: { className: NUMERIC },
	}),
	columnHelper.accessor('exactHits', {
		header: 'Dokładne',
		meta: { className: NUMERIC },
	}),
	columnHelper.accessor('points', {
		header: 'Punkty',
		meta: { className: `${NUMERIC} font-semibold` },
	}),
]);
