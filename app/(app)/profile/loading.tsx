import { HeadingSkeleton } from '@/components/loading/heading-skeleton';
import { LoadingRegion } from '@/components/loading/loading-region';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfileLoading() {
	return (
		<LoadingRegion
			label="Ładowanie profilu…"
			className="max-w-2xl mx-auto my-6 space-y-6"
		>
			<HeadingSkeleton />
			<div className="flex items-center gap-4">
				<Skeleton className="size-14" />
				<div className="space-y-2">
					<Skeleton className="h-4 w-40" />
					<Skeleton className="h-3 w-52" />
				</div>
			</div>
			<div className="grid grid-cols-2 gap-4">
				<Skeleton className="h-20" />
				<Skeleton className="h-20" />
			</div>
			<Skeleton className="h-32 w-full" />
		</LoadingRegion>
	);
}
