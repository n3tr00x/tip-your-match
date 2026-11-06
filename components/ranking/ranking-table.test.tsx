import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { RankingTable } from '@/components/ranking/ranking-table';

import { makeRankingEntry } from '@/test/factories';

const players = [
	makeRankingEntry({ userId: 'zofia', name: 'Zofia', position: 1, points: 30 }),
	makeRankingEntry({ userId: 'adam', name: 'Adam', position: 2, points: 25 }),
	makeRankingEntry({ userId: 'lukasz', name: 'Łukasz', position: 3, points: 20 }),
];

function getPlayerNames() {
	const [, ...bodyRows] = screen.getAllByRole('row');

	return bodyRows.map((row) => within(row).getAllByRole('cell')[1].textContent);
}

function makePlayers(count: number) {
	return Array.from({ length: count }, (_, index) =>
		makeRankingEntry({
			userId: `player-${index + 1}`,
			name: `Gracz ${String(index + 1).padStart(2, '0')}`,
			position: index + 1,
		}),
	);
}

describe('RankingTable', () => {
	it('lists players by ranking position', () => {
		render(<RankingTable data={[players[2], players[0], players[1]]} currentUserId="adam" />);

		expect(getPlayerNames()).toEqual(['Zofia', 'Adam(Ty)', 'Łukasz']);
	});

	it('marks the current user', () => {
		render(<RankingTable data={players} currentUserId="adam" />);

		const row = screen.getByText('(Ty)').closest('tr')!;

		expect(within(row).getByText('Adam')).toBeInTheDocument();
		expect(screen.getAllByText('(Ty)')).toHaveLength(1);
	});

	it('shows all season columns', () => {
		render(<RankingTable data={players} currentUserId="adam" />);

		const headers = screen.getAllByRole('columnheader').map((header) => header.textContent);

		expect(headers).toEqual([
			'#',
			'Gracz',
			'Kolejki',
			'Mecze',
			'Śr. / kolejkę',
			'Dokładne',
			'Punkty',
		]);
	});

	it('formats the average per round with two decimals', () => {
		render(
			<RankingTable
				data={[makeRankingEntry({ userId: 'adam', averagePerRound: 7.5 })]}
				currentUserId="adam"
			/>,
		);

		expect(screen.getByText('7,50')).toBeInTheDocument();
	});

	describe('search', () => {
		it('filters players ignoring case and Polish diacritics', async () => {
			const user = userEvent.setup();
			render(<RankingTable data={players} currentUserId="adam" />);

			await user.type(screen.getByRole('searchbox', { name: 'Szukaj gracza' }), 'LUKASZ');

			expect(getPlayerNames()).toEqual(['Łukasz']);
		});

		it('shows a message when no player matches', async () => {
			const user = userEvent.setup();
			render(<RankingTable data={players} currentUserId="adam" />);

			await user.type(screen.getByRole('searchbox'), 'Kasia');

			expect(screen.getByText('Nie znaleziono gracza "Kasia"')).toBeInTheDocument();
		});
	});

	describe('sorting', () => {
		it('marks the ranking as sorted by position by default', () => {
			render(<RankingTable data={players} currentUserId="adam" />);

			expect(screen.getByRole('columnheader', { name: '#' })).toHaveAttribute(
				'aria-sort',
				'ascending',
			);
		});

		it('sorts by name alphabetically in Polish order and toggles the direction', async () => {
			const user = userEvent.setup();
			render(<RankingTable data={players} currentUserId="adam" />);
			const nameHeader = screen.getByRole('columnheader', { name: 'Gracz' });

			await user.click(within(nameHeader).getByRole('button'));

			expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
			expect(getPlayerNames()).toEqual(['Adam(Ty)', 'Łukasz', 'Zofia']);

			await user.click(within(nameHeader).getByRole('button'));

			expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
			expect(getPlayerNames()).toEqual(['Zofia', 'Łukasz', 'Adam(Ty)']);
		});
	});

	describe('pagination', () => {
		it('hides pagination and the current position shortcut on a single page', () => {
			render(<RankingTable data={players} currentUserId="adam" />);

			expect(screen.queryByRole('navigation', { name: 'Strony rankingu' })).not.toBeInTheDocument();
			expect(screen.queryByRole('button', { name: 'Pokaż moją pozycję' })).not.toBeInTheDocument();
		});

		it('shows 20 players per page and moves between pages', async () => {
			const user = userEvent.setup();
			render(<RankingTable data={makePlayers(25)} currentUserId="player-1" />);

			expect(getPlayerNames()).toHaveLength(20);
			expect(screen.getByText('Strona 1 z 2')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Poprzednia strona' })).toBeDisabled();

			await user.click(screen.getByRole('button', { name: 'Następna strona' }));

			expect(getPlayerNames()).toHaveLength(5);
			expect(screen.getByText('Strona 2 z 2')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: 'Następna strona' })).toBeDisabled();
		});

		it('jumps to the page with the current user', async () => {
			const user = userEvent.setup();
			render(<RankingTable data={makePlayers(25)} currentUserId="player-23" />);
			const showMine = screen.getByRole('button', { name: 'Pokaż moją pozycję' });

			await user.click(showMine);

			expect(screen.getByText('Strona 2 z 2')).toBeInTheDocument();
			expect(screen.getByText('(Ty)')).toBeInTheDocument();
			expect(showMine).toBeDisabled();
		});
	});

	describe('round variant', () => {
		it('shows only position, name and points without search', () => {
			render(<RankingTable data={players} currentUserId="adam" variant="round" />);

			const headers = screen.getAllByRole('columnheader').map((header) => header.textContent);

			expect(headers).toEqual(['#', 'Gracz', 'Punkty']);
			expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
		});
	});
});
