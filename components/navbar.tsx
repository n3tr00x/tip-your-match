import Link from 'next/link';
import { NavLinks } from '@/components/nav-links';
import { SignOutButton } from '@/components/sign-out-button';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
	return (
		<header className="sticky top-0 z-40 border-b bg-background/60 backdrop-blur-xl backdrop-saturate-150">
			<div className="container mx-auto flex h-14 items-center justify-between px-6 md:grid md:grid-cols-[1fr_auto_1fr]">
				<Link
					href="/"
					className="font-heading text-sm font-bold uppercase tracking-widest"
				>
					Tip Your Match
				</Link>

				<NavLinks />

				<div className="flex items-center gap-2 md:justify-self-end">
					<ThemeToggle />
					<SignOutButton />
				</div>
			</div>
		</header>
	);
}
