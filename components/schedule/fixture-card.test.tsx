import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FixtureCard } from '@/components/schedule/fixture-card';

import { makeFixture } from '@/test/factories';

describe('FixtureCard', () => {
	it('shows the local kickoff and status of a scheduled match', () => {
		render(<FixtureCard fixture={makeFixture({ kickoff: new Date('2026-03-14T18:00:00Z') })} />);

		expect(screen.getByText('SOB 14.03 · 19:00')).toBeInTheDocument();
		expect(screen.getByText('Zaplanowany')).toBeInTheDocument();
	});

	it('shows both teams with their crests', () => {
		render(<FixtureCard fixture={makeFixture({ homeTeam: 'Lech', awayTeam: 'Legia' })} />);

		expect(screen.getByText('Lech')).toBeInTheDocument();
		expect(screen.getByRole('img', { name: 'Lech' })).toBeInTheDocument();
		expect(screen.getByText('Legia')).toBeInTheDocument();
		expect(screen.getByRole('img', { name: 'Legia' })).toBeInTheDocument();
	});

	it('shows dashes before the match has a score', () => {
		render(<FixtureCard fixture={makeFixture()} />);

		expect(screen.getAllByText('-')).toHaveLength(2);
	});

	it('shows the score of a finished match', () => {
		render(
			<FixtureCard fixture={makeFixture({ status: 'FINISHED', homeScore: 3, awayScore: 1 })} />,
		);

		expect(screen.getByText('Zakończony')).toBeInTheDocument();
		expect(screen.getByText('3')).toBeInTheDocument();
		expect(screen.getByText('1')).toBeInTheDocument();
	});
});
