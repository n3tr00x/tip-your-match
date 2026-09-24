'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { buttonVariants } from '@/components/ui/button';
import { isLinkActive, navLinks } from '@/lib/nav-links';

export function NavLinks() {
	const pathname = usePathname();

	return (
		<nav
			className="hidden md:flex items-center gap-1"
			aria-label="Main navigation"
		>
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
