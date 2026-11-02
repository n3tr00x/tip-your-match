import Image from 'next/image';

import { cn } from '@/lib/utils';

type TeamInfoProps = {
	name: string;
	logo: string;
	nameClassName?: string;
};

export function TeamInfo({ name, logo, nameClassName }: TeamInfoProps) {
	return (
		<div className="flex min-w-0 items-center">
			<Image src={logo} alt={name} width={32} height={32} className="size-8 object-contain" />
			<span
				className={cn('ml-4 truncate text-sm font-medium tracking-widest uppercase', nameClassName)}
			>
				{name}
			</span>
		</div>
	);
}
