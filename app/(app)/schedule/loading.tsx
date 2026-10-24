import { LoadingRegion } from '@/components/loading/loading-region';
import { Skeleton } from '@/components/ui/skeleton';

export default function ScheduleLoading() {
	return (
		<LoadingRegion
			label="Ładowanie terminarza…"
			className="max-w-7xl mx-auto my-4"
		>
			{Array.from({ length: 5 }, (_, index) => (
				<div
					key={index}
					className="flex items-center justify-between border-b px-4 py-4"
				>
					<Skeleton className="h-4 w-28" />
					<Skeleton className="h-3 w-24" />
				</div>
			))}
		</LoadingRegion>
	);
}
