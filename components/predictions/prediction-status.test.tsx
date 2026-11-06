import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PredictionStatus } from '@/components/predictions/prediction-status';

describe('PredictionStatus', () => {
	it('shows a missing prediction before the match is finished', () => {
		render(<PredictionStatus status="SCHEDULED" isSaved={false} points={null} />);

		expect(screen.getByText('Brak typu')).toBeInTheDocument();
	});

	it.each(['SCHEDULED', 'LIVE', 'POSTPONED'] as const)(
		'confirms a saved prediction for a %s match',
		(status) => {
			render(<PredictionStatus status={status} isSaved points={null} />);

			expect(screen.getByText('Typ zapisany')).toBeInTheDocument();
		},
	);

	it('shows the scored result once the match is finished', () => {
		render(<PredictionStatus status="FINISHED" isSaved points={3} />);

		expect(screen.getByText('Dokładny wynik · +3')).toBeInTheDocument();
		expect(screen.queryByText('Typ zapisany')).not.toBeInTheDocument();
	});

	it('shows a missed prediction with zero points once the match is finished', () => {
		render(<PredictionStatus status="FINISHED" isSaved={false} points={null} />);

		expect(screen.getByText('Brak typu · 0')).toBeInTheDocument();
	});
});
