import { HeadingSkeleton } from '@/components/loading/heading-skeleton';
import { LoadingRegion } from '@/components/loading/loading-region';
import { TableSkeleton } from '@/components/loading/table-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function RankingLoading() {
	return (
		<LoadingRegion
			label="Ładowanie rankingu…"
			className="max-w-7xl mx-auto my-6 space-y-6"
		>
			<HeadingSkeleton />
			<div className="space-y-4">
				<Skeleton className="h-10 w-full max-w-xs" />
				<TableSkeleton />
			</div>
		</LoadingRegion>
	);
}
