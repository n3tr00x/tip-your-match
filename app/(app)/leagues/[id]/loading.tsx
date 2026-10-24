import { LoadingRegion } from '@/components/loading/loading-region';
import { TableSkeleton } from '@/components/loading/table-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeagueLoading() {
	return (
		<LoadingRegion
			label="Ładowanie ligi…"
			className="max-w-7xl mx-auto my-6 space-y-8"
		>
			<div className="flex flex-wrap items-center justify-between gap-4 border-b pb-2">
				<Skeleton className="h-5 w-48" />
				<Skeleton className="h-9 w-40" />
			</div>
			<div className="space-y-4">
				<Skeleton className="h-4 w-24" />
				<TableSkeleton rows={5} />
			</div>
			<div className="space-y-4">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="h-40 w-full" />
			</div>
		</LoadingRegion>
	);
}
