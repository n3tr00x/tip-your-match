import { ArrowRightIcon, ClockIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useId } from 'react';

import type { Fixture } from '@/app/generated/prisma/client';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { formatMatchDate } from '@/lib/date';
import { getPredictionDeadline } from '@/lib/predictions/rules';

type NextFixtureProps = {
	fixture: Fixture | undefined;
};

type TeamCrestProps = {
	name: string;
	logo: string;
};

function TeamCrest({ name, logo }: TeamCrestProps) {
	return (
		<div className="flex min-w-0 flex-col items-center gap-3">
			<Image
				src={logo}
				alt=""
				width={80}
				height={80}
				className="size-14 object-contain sm:size-20"
			/>
			<span className="w-full truncate text-center text-xs font-medium uppercase tracking-widest sm:text-sm">
				{name}
			</span>
		</div>
	);
}

function MatchPoster({ fixture }: { fixture: Fixture }) {
	const { date, time } = formatMatchDate(fixture.kickoff);
	const { time: deadline } = formatMatchDate(
		getPredictionDeadline(fixture.kickoff),
	);

	return (
		<Link
			href="/predictions"
			className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
		>
			<Card className="ring-0 border-2 border-primary/75 bg-linear-to-b from-primary/10 to-transparent shadow transition-colors group-hover:border-primary">
				<CardContent>
					<div className="mx-auto grid max-w-2xl grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-6">
						<TeamCrest name={fixture.homeTeam} logo={fixture.homeTeamLogo} />
						<div className="flex flex-col items-center gap-1 text-center">
							<span className="text-[0.625rem] uppercase tracking-widest text-muted-foreground">
								Kolejka {fixture.round}
							</span>
							<time
								dateTime={fixture.kickoff.toISOString()}
								className="font-heading text-3xl tabular-nums sm:text-5xl"
							>
								{time}
							</time>
							<span className="text-xs uppercase tracking-widest text-muted-foreground tabular-nums">
								{date}
							</span>
						</div>
						<TeamCrest name={fixture.awayTeam} logo={fixture.awayTeamLogo} />
					</div>
				</CardContent>
				<CardFooter className="border-t">
					<div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 text-[0.625rem] uppercase tracking-widest">
						<span className="flex items-center gap-1 text-muted-foreground">
							<ClockIcon className="size-3" />
							Typowanie do {deadline}
						</span>
						<span className="flex items-center gap-1 text-primary">
							Przejdź do typowania
							<ArrowRightIcon className="size-3 transition-transform group-hover:translate-x-0.5" />
						</span>
					</div>
				</CardFooter>
			</Card>
		</Link>
	);
}

export function NextFixture({ fixture }: NextFixtureProps) {
	const headingId = useId();

	return (
		<section aria-labelledby={headingId} className="space-y-4">
			<h2
				id={headingId}
				className="font-heading uppercase tracking-widest border-b pb-2"
			>
				Następny mecz do typowania
			</h2>
			{fixture ? (
				<MatchPoster fixture={fixture} />
			) : (
				<p className="text-muted-foreground">
					Brak nadchodzących meczów do typowania
				</p>
			)}
		</section>
	);
}
