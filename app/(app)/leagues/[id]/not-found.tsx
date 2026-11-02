import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';

export default function LeagueNotFound() {
	return (
		<div className="mx-auto my-6 max-w-7xl space-y-4">
			<h1 className="font-heading tracking-widest uppercase">Nie znaleziono ligi</h1>
			<p className="text-muted-foreground">
				Liga nie istnieje albo do niej nie należysz. Jeśli masz kod, dołącz do ligi na liście lig.
			</p>
			<Link href="/leagues" className={buttonVariants({ variant: 'outline' })}>
				Wróć do lig
			</Link>
		</div>
	);
}
