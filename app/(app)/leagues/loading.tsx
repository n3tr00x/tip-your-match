import { HeadingSkeleton } from '@/components/loading/heading-skeleton';
import { LoadingRegion } from '@/components/loading/loading-region';
import { Skeleton } from '@/components/ui/skeleton';

export default function LeaguesLoading() {
	return (
		<LoadingRegion
			label="Ładowanie lig…"
			className="max-w-7xl mx-auto my-6 space-y-8"
		>
			<HeadingSkeleton />
			<div className="space-y-4">
				<Skeleton className="h-4 w-28" />
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{Array.from({ length: 3 }, (_, index) => (
						<Skeleton key={index} className="h-20 w-full" />
					))}
				</div>
			</div>
			<div className="grid gap-4 md:grid-cols-2">
				<Skeleton className="h-64 w-full" />
				<Skeleton className="h-64 w-full" />
			</div>
		</LoadingRegion>
	);
}
