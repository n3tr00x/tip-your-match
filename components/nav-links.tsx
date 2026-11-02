'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { isLinkActive, navLinks } from '@/lib/nav-links';

import { buttonVariants } from '@/components/ui/button';

export function NavLinks() {
	const pathname = usePathname();

	return (
		<nav className="hidden items-center gap-1 md:flex" aria-label="Główna nawigacja">
			{navLinks.map(({ href, label }) => {
				const isActive = isLinkActive(pathname, href);

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
