import { Skeleton } from '@/components/ui/skeleton';

export function HeadingSkeleton() {
	return (
		<div className="flex items-center justify-between gap-4 border-b pb-2">
			<Skeleton className="h-6 w-40" />
		</div>
	);
}
