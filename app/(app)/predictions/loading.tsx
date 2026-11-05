import { HeadingSkeleton } from '@/components/loading/heading-skeleton';
import { LoadingRegion } from '@/components/loading/loading-region';
import { MatchGridSkeleton } from '@/components/loading/match-card-skeleton';

export default function PredictionsLoading() {
	return (
		<LoadingRegion
			label="Ładowanie meczów do typowania…"
			className="mx-auto my-6 max-w-7xl space-y-4"
		>
			<HeadingSkeleton />
			<MatchGridSkeleton />
		</LoadingRegion>
	);
}
