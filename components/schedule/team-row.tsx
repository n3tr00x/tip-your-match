import { cn } from '@/lib/utils';

import { TeamInfo } from '@/components/team-info';

type TeamRowProps = {
	name: string;
	logo: string;
	score: number | null;
	variant: 'winner' | 'loser' | 'default';
};

export function TeamRow({ name, logo, score, variant }: TeamRowProps) {
	return (
		<div className="flex items-center justify-between">
			<TeamInfo
				name={name}
				logo={logo}
				nameClassName={cn({
					'font-semibold': variant === 'winner',
					'text-muted-foreground': variant === 'loser',
				})}
			/>
			<span className="font-heading text-lg tabular-nums">{score ?? '-'}</span>
		</div>
	);
}
