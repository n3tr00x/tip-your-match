import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { Round } from '@/lib/schedule/rounds';

import { RoundHeader } from '@/components/schedule/round-header';

import { makeFixture } from '@/test/factories';

const round: Round = {
	round: 5,
	fixtures: [
		makeFixture({ round: 5, kickoff: new Date('2026-03-14T15:00:00Z'), status: 'FINISHED' }),
		makeFixture({ round: 5, kickoff: new Date('2026-03-15T15:00:00Z'), status: 'FINISHED' }),
		makeFixture({ round: 5, kickoff: new Date('2026-03-16T19:00:00Z') }),
	],
};

describe('RoundHeader', () => {
	it('shows the round number, dates and progress', () => {
		render(<RoundHeader round={round} state="upcoming" />);

		expect(screen.getByText('Kolejka 5')).toBeInTheDocument();
		expect(screen.getByText('14.03 – 16.03')).toBeInTheDocument();
		expect(screen.getByText('2/3')).toHaveTextContent('2/3 rozegranych meczów');
	});

	it('marks the current round', () => {
		render(<RoundHeader round={round} state="current" />);

		expect(screen.getByText('Aktualna')).toBeInTheDocument();
		expect(screen.queryByText('Zaległa')).not.toBeInTheDocument();
	});

	it('marks a round with unplayed fixtures as pending', () => {
		render(<RoundHeader round={round} state="pending" />);

		expect(screen.getByText('Zaległa')).toBeInTheDocument();
		expect(screen.queryByText('Aktualna')).not.toBeInTheDocument();
	});

	it.each(['upcoming', 'finished'] as const)('shows no badge for a %s round', (state) => {
		render(<RoundHeader round={round} state={state} />);

		expect(screen.queryByText('Aktualna')).not.toBeInTheDocument();
		expect(screen.queryByText('Zaległa')).not.toBeInTheDocument();
	});
});
