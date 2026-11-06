import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MatchScore } from '@/components/predictions/match-score';

describe('MatchScore', () => {
	it('shows the final score', () => {
		render(<MatchScore fixture={{ homeScore: 2, awayScore: 0 }} />);

		expect(screen.getByText('2:0')).toBeInTheDocument();
	});

	it.each([
		{ homeScore: null, awayScore: null },
		{ homeScore: 1, awayScore: null },
	])('renders nothing without a full score ($homeScore:$awayScore)', (fixture) => {
		const { container } = render(<MatchScore fixture={fixture} />);

		expect(container).toBeEmptyDOMElement();
	});
});
