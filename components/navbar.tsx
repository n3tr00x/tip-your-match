import Link from 'next/link';
import { NavLinks } from '@/components/nav-links';
import { SignOutButton } from '@/components/sign-out-button';
import { ThemeToggle } from '@/components/theme-toggle';

export function Navbar() {
	return (
		<header className="sticky top-0 z-40 border-b bg-background/60 backdrop-blur-xl backdrop-saturate-150">
			<div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center px-6 container mx-auto">
				<Link
					href="/"
					className="justify-self-start font-heading text-sm font-bold uppercase tracking-widest"
				>
					Tip Your Match
				</Link>

				<NavLinks />

				<div className="flex items-center justify-self-end gap-2">
					<ThemeToggle />
					<SignOutButton />
				</div>
			</div>
		</header>
	);
}
