import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LeagueCard } from '@/components/leagues/league-card';

describe('LeagueCard', () => {
	it('links to the league and shows its member count against the limit', () => {
		render(
			<LeagueCard league={{ id: 'league-1', name: 'Biuro', memberCount: 7, isAdmin: false }} />,
		);

		const link = screen.getByRole('link');

		expect(link).toHaveAttribute('href', '/leagues/league-1');
		expect(link).toHaveTextContent('Biuro');
		expect(link).toHaveTextContent('7/50');
		expect(screen.queryByText('Admin')).not.toBeInTheDocument();
	});

	it('shows an admin badge for the league admin', () => {
		render(
			<LeagueCard league={{ id: 'league-1', name: 'Biuro', memberCount: 1, isAdmin: true }} />,
		);

		expect(screen.getByText('Admin')).toBeInTheDocument();
	});
});
