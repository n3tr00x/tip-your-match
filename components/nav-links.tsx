'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';

const links = [
	{ href: '/predictions', label: 'Typuj' },
	{ href: '/schedule', label: 'Terminarz' },
	{ href: '/ranking', label: 'Ranking' },
	{ href: '/leagues', label: 'Ligi' },
];

export function NavLinks() {
	const pathname = usePathname();

	return (
		<nav className="flex items-center gap-1">
			{links.map(({ href, label }) => {
				const isActive = pathname === href || pathname.startsWith(`${href}/`);

				return (
					<Link
						key={href}
						href={href}
						aria-current={isActive ? 'page' : undefined}
						className={buttonVariants({
							variant: isActive ? 'link' : 'ghost',
							size: 'sm',
						})}
					>
						{label}
					</Link>
				);
			})}
		</nav>
	);
}
