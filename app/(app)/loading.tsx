import { HeadingSkeleton } from '@/components/loading/heading-skeleton';
import { LoadingRegion } from '@/components/loading/loading-region';
import { TableSkeleton } from '@/components/loading/table-skeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomeLoading() {
	return (
		<LoadingRegion
			label="Ładowanie panelu…"
			className="max-w-7xl mx-auto my-6 space-y-6"
		>
			<HeadingSkeleton />
			<div className="grid grid-cols-2 gap-4">
				<Skeleton className="h-20" />
				<Skeleton className="h-20" />
			</div>
			<div className="space-y-4">
				<HeadingSkeleton />
				<Skeleton className="h-64 w-full" />
			</div>
			<div className="space-y-4">
				<HeadingSkeleton />
				<TableSkeleton />
			</div>
		</LoadingRegion>
	);
}
