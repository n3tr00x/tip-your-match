import Image from 'next/image';
import { cn } from '@/lib/utils';

type TeamRowProps = {
	name: string;
	logo: string;
	score: number | null;
	variant: 'winner' | 'loser' | 'default';
};

export function TeamRow({ name, logo, score, variant }: TeamRowProps) {
	return (
		<div className="flex justify-between items-center">
			<div className="flex items-center min-w-0">
				<Image
					src={logo}
					alt={name}
					width={32}
					height={32}
					className="object-contain size-8"
				/>
				<span
					className={cn(
						'ml-4 text-sm tracking-widest font-medium uppercase truncate',
						{
							'font-semibold': variant === 'winner',
							'text-muted-foreground': variant === 'loser',
						},
					)}
				>
					{name}
				</span>
			</div>
			<span className="font-heading text-lg tabular-nums">{score ?? '-'}</span>
		</div>
	);
}
