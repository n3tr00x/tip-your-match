import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoadingRegion } from '@/components/loading/loading-region';

describe('LoadingRegion', () => {
	it('announces the loading label to screen readers and marks the region busy', () => {
		render(
			<LoadingRegion label="Ładowanie rankingu">
				<p>Szkielet</p>
			</LoadingRegion>,
		);

		const status = screen.getByRole('status');

		expect(status).toHaveTextContent('Ładowanie rankingu');
		expect(status.parentElement).toHaveAttribute('aria-busy', 'true');
		expect(screen.getByText('Szkielet')).toBeInTheDocument();
	});
});
