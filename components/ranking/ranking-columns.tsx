import {
	constructFilterFn,
	createColumnHelper,
	filterFn_includesString,
} from '@tanstack/react-table';

import { rankingFeatures } from '@/components/ranking/ranking-features';
import type { RankingEntry } from '@/lib/ranking/queries';

const columnHelper = createColumnHelper<typeof rankingFeatures, RankingEntry>();
const nameCollator = new Intl.Collator('pl');
const averageFormatter = new Intl.NumberFormat('pl-PL', {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});
const NUMERIC = 'text-right tabular-nums';
const NUMERIC_DESKTOP = `${NUMERIC} hidden sm:table-cell`;

function normalizeName(value: unknown) {
	return String(value ?? '')
		.toLocaleLowerCase('pl')
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/ł/g, 'l');
}

const includesNameIgnoringCaseAndDiacritics = constructFilterFn({
	...filterFn_includesString,
	resolveFilterValue: normalizeName,
	resolveDataValue: normalizeName,
});

export const rankingColumns = columnHelper.columns([
	columnHelper.accessor('position', {
		header: '#',
		sortDescFirst: false,
		meta: { className: 'w-12 tabular-nums' },
	}),
	columnHelper.accessor('name', {
		header: 'Gracz',
		sortFn: (rowA, rowB) =>
			nameCollator.compare(rowA.original.name, rowB.original.name),
		filterFn: includesNameIgnoringCaseAndDiacritics,
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
