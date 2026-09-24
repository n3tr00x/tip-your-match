'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isLinkActive, navLinks } from '@/lib/nav-links';
import { cn } from '@/lib/utils';

export function MobileNavbar() {
	const pathname = usePathname();

	return (
		<nav
			aria-label="Główna nawigacja"
			className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/60 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 md:hidden"
		>
			<ul className="grid grid-cols-4">
				{navLinks.map(({ href, label, icon: Icon }) => {
					const isActive = isLinkActive(pathname, href);

					return (
						<li key={href}>
							<Link
								href={href}
								aria-current={isActive ? 'page' : undefined}
								className={cn(
									'flex h-14 flex-col items-center justify-center gap-1 text-[0.625rem] font-semibold uppercase tracking-widest transition-colors',
									isActive
										? 'text-primary'
										: 'text-muted-foreground hover:text-foreground',
								)}
							>
								<Icon className="size-5" />
								{label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
