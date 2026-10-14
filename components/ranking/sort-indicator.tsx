import type { SortDirection } from '@tanstack/react-table';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';

type SortIndicatorProps = {
	direction: SortDirection | false;
};

export function SortIndicator({ direction }: SortIndicatorProps) {
	if (direction === 'asc') {
		return <ArrowUpIcon aria-hidden className="size-3" />;
	}

	if (direction === 'desc') {
		return <ArrowDownIcon aria-hidden className="size-3" />;
	}

	return <ArrowUpDownIcon aria-hidden className="size-3 opacity-40" />;
}
