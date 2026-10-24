import { ReactNode } from 'react';

type LoadingRegionProps = {
	children: ReactNode;
	label: string;
	className?: string;
};

export function LoadingRegion({
	children,
	label,
	className,
}: LoadingRegionProps) {
	return (
		<div aria-busy="true" className={className}>
			<span role="status" className="sr-only">
				{label}
			</span>
			{children}
		</div>
	);
}
