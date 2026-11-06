import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LockStatus } from '@/components/predictions/lock-status';

// 18:00 UTC is 19:00 in Warsaw, so predictions lock at 18:55 local time
const kickoff = new Date('2026-03-14T18:00:00Z');

describe('LockStatus', () => {
	it('shows the local deadline while predictions are open', () => {
		render(<LockStatus fixture={{ kickoff, status: 'SCHEDULED' }} isOpen />);

		expect(screen.getByText('Do 18:55')).toBeInTheDocument();
	});

	it('shows a closed state for a scheduled match after the deadline', () => {
		render(<LockStatus fixture={{ kickoff, status: 'SCHEDULED' }} isOpen={false} />);

		expect(screen.getByText('Zamknięte')).toBeInTheDocument();
	});

	it.each([
		{ status: 'LIVE', label: 'Na żywo' },
		{ status: 'FINISHED', label: 'Zakończony' },
		{ status: 'POSTPONED', label: 'Przełożony' },
		{ status: 'CANCELLED', label: 'Odwołany' },
	] as const)('shows "$label" for a $status match', ({ status, label }) => {
		render(<LockStatus fixture={{ kickoff, status }} isOpen={false} />);

		expect(screen.getByText(label)).toBeInTheDocument();
	});
});
