import { HeadingSkeleton } from '@/components/loading/heading-skeleton';
import { LoadingRegion } from '@/components/loading/loading-region';
import { MatchGridSkeleton } from '@/components/loading/match-card-skeleton';

export default function PredictionsLoading() {
	return (
		<LoadingRegion
			label="Ładowanie meczów do typowania…"
			className="max-w-7xl mx-auto my-6 space-y-4"
		>
			<HeadingSkeleton />
			<MatchGridSkeleton />
		</LoadingRegion>
	);
}
