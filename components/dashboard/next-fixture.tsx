import { useId } from 'react';
import type { Fixture } from '@/app/generated/prisma/client';
import { FixtureCard } from '../schedule/fixture-card';
import Link from 'next/link';

type NextFixtureProps = {
	fixture: Fixture | undefined;
};

export function NextFixture({ fixture }: NextFixtureProps) {
	const headingId = useId();

	return (
		<section aria-labelledby={headingId} className="space-y-4">
			<h2
				id={headingId}
				className="font-heading uppercase tracking-widest border-b pb-2"
			>
				Następny mecz
			</h2>
			{fixture ? (
				<>
					<FixtureCard fixture={fixture} />
					<Link
						href="/predictions"
						className="text-xs text-primary underline-offset-4 hover:underline"
					>
						Typuj mecze
					</Link>
				</>
			) : (
				<p className="text-muted-foreground">Brak nadchodzących meczów</p>
			)}
		</section>
	);
}
