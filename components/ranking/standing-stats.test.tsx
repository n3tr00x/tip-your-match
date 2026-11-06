import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { StandingStats } from '@/components/ranking/standing-stats';

describe('StandingStats', () => {
	it('invites a player without scored predictions to make some', () => {
		render(<StandingStats standing={null} />);

		expect(
			screen.getByText('Nie masz jeszcze rozliczonych typów w tym sezonie.', { exact: false }),
		).toBeInTheDocument();
		expect(screen.getByRole('link', { name: 'Typuj mecze' })).toHaveAttribute(
			'href',
			'/predictions',
		);
	});

	it('shows the ranking position and points', () => {
		render(<StandingStats standing={{ position: 3, totalPlayers: 12, points: 41 }} />);

		const [position, points] = screen.getAllByRole('definition');

		expect(position).toHaveTextContent('3 / 12');
		expect(points).toHaveTextContent('41');
		expect(screen.getByRole('link', { name: 'Zobacz pełny ranking' })).toHaveAttribute(
			'href',
			'/ranking',
		);
	});
});
