import {
	Card,
	CardContent,
	CardHeader,
	CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function MatchCardSkeleton() {
	return (
		<Card size="sm" className="ring-0 border-2 border-border shadow">
			<CardHeader className="flex items-center justify-between">
				<Skeleton className="h-3 w-40" />
				<Skeleton className="h-3 w-16" />
			</CardHeader>
			<CardContent className="flex flex-col gap-y-4">
				{[0, 1].map(team => (
					<div key={team} className="flex items-center justify-between gap-4">
						<div className="flex items-center gap-4">
							<Skeleton className="size-8 rounded-full" />
							<Skeleton className="h-4 w-32" />
						</div>
						<Skeleton className="h-10 w-12" />
					</div>
				))}
			</CardContent>
			<CardFooter className="justify-between gap-4">
				<Skeleton className="h-3 w-20" />
				<Skeleton className="h-9 w-20" />
			</CardFooter>
		</Card>
	);
}

export function MatchGridSkeleton({ count = 6 }: { count?: number }) {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: count }).map((_, index) => (
				<MatchCardSkeleton key={index} />
			))}
		</div>
	);
}
