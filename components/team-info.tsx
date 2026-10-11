import Image from 'next/image';
import { cn } from '@/lib/utils';

type TeamInfoProps = {
	name: string;
	logo: string;
	nameClassName?: string;
};

export function TeamInfo({ name, logo, nameClassName }: TeamInfoProps) {
	return (
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
					nameClassName,
				)}
			>
				{name}
			</span>
		</div>
	);
}
