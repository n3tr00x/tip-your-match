import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { POINTS } from '@/lib/predictions/scoring';

import { PredictionResult } from '@/components/predictions/prediction-result';

describe('PredictionResult', () => {
	it('shows a missing prediction when nothing was saved', () => {
		render(<PredictionResult isSaved={false} points={null} />);

		expect(screen.getByText('Brak typu · 0')).toBeInTheDocument();
	});

	it('shows a pending state when the prediction is not scored yet', () => {
		render(<PredictionResult isSaved points={null} />);

		expect(screen.getByText('Oczekuje na rozliczenie')).toBeInTheDocument();
	});

	it.each([
		{ points: POINTS.EXACT, text: 'Dokładny wynik · +3' },
		{ points: POINTS.OUTCOME, text: 'Trafiony rezultat · +1' },
		{ points: POINTS.MISS, text: 'Pudło · 0' },
	])('shows "$text" for $points points', ({ points, text }) => {
		render(<PredictionResult isSaved points={points} />);

		expect(screen.getByText(text)).toBeInTheDocument();
		expect(screen.queryByText('Oczekuje na rozliczenie')).not.toBeInTheDocument();
	});

	it('falls back to the pending state for points without a variant', () => {
		render(<PredictionResult isSaved points={2} />);

		expect(screen.getByText('Oczekuje na rozliczenie')).toBeInTheDocument();
	});
});
