import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FormErrors } from '@/components/form-errors';

describe('FormErrors', () => {
	it.each([{ errors: undefined }, { errors: [] }])('renders nothing for $errors', ({ errors }) => {
		const { container } = render(<FormErrors id="errors" errors={errors} />);

		expect(container).toBeEmptyDOMElement();
	});

	it('announces every error as an alert', () => {
		render(<FormErrors id="errors" errors={['Podaj nazwę ligi', 'Kod jest za krótki']} />);

		const alert = screen.getByRole('alert');

		expect(alert).toHaveAttribute('id', 'errors');
		expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual([
			'Podaj nazwę ligi',
			'Kod jest za krótki',
		]);
	});

	it('can be linked to an input through aria-describedby', () => {
		render(
			<>
				<input aria-label="Nazwa" aria-describedby="name-errors" />
				<FormErrors id="name-errors" errors={['Podaj nazwę']} />
			</>,
		);

		expect(screen.getByRole('textbox', { name: 'Nazwa' })).toHaveAccessibleDescription(
			'Podaj nazwę',
		);
	});
});
