import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ProfileSummary } from '@/components/profile/profile-summary';

describe('ProfileSummary', () => {
	it('shows the name, email, initials and account age', () => {
		render(
			<ProfileSummary
				name="Łukasz Żak"
				email="lukasz@example.com"
				createdAt={new Date('2026-03-01T12:00:00Z')}
			/>,
		);

		expect(screen.getByText('Łukasz Żak')).toBeInTheDocument();
		expect(screen.getByText('lukasz@example.com')).toBeInTheDocument();
		expect(screen.getByText('ŁŻ')).toHaveAttribute('aria-hidden', 'true');
		expect(screen.getByText('Konto od marzec 2026')).toBeInTheDocument();
	});
});
