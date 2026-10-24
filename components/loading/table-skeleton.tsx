import { Skeleton } from '@/components/ui/skeleton';

export function TableSkeleton({ rows = 8 }: { rows?: number }) {
	return (
		<div className="space-y-1">
			<Skeleton className="h-12 w-full" />
			{Array.from({ length: rows }, (_, index) => (
				<Skeleton key={index} className="h-11 w-full opacity-60" />
			))}
		</div>
	);
}
