import { Button } from '@/components/ui/button';

type RankingPaginationProps = {
	pageIndex: number;
	pageCount: number;
	canPreviousPage: boolean;
	canNextPage: boolean;
	onPreviousPage: () => void;
	onNextPage: () => void;
};

export function RankingPagination({
	pageIndex,
	pageCount,
	canPreviousPage,
	canNextPage,
	onPreviousPage,
	onNextPage,
}: RankingPaginationProps) {
	if (pageCount <= 1) {
		return null;
	}

	return (
		<nav
			aria-label="Strony rankingu"
			className="flex items-center justify-between gap-2"
		>
			<span className="text-xs text-muted-foreground tabular-nums">
				Strona {pageIndex + 1} z {pageCount}
			</span>
			<div className="flex gap-1">
				<Button
					aria-label="Poprzednia strona"
					variant="outline"
					size="sm"
					onClick={onPreviousPage}
					disabled={!canPreviousPage}
				>
					Poprzednia
				</Button>

				<Button
					aria-label="Następna strona"
					variant="outline"
					size="sm"
					onClick={onNextPage}
					disabled={!canNextPage}
				>
					Następna
				</Button>
			</div>
		</nav>
	);
}
