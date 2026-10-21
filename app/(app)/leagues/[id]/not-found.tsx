import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

export default function LeagueNotFound() {
	return (
		<div className="max-w-7xl mx-auto my-6 space-y-4">
			<h1 className="font-heading uppercase tracking-widest">
				Nie znaleziono ligi
			</h1>
			<p className="text-muted-foreground">
				Liga nie istnieje albo do niej nie należysz. Jeśli masz kod, dołącz do
				ligi na liście lig.
			</p>
			<Link href="/leagues" className={buttonVariants({ variant: 'outline' })}>
				Wróć do lig
			</Link>
		</div>
	);
}
