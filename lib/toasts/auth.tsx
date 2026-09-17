import { ReactNode } from 'react';
import { toast } from '@/components/ui/toast';

export function errorFormFieldsToast(errors: string | string[]) {
	let description: ReactNode;

	if (typeof errors === 'string') {
		description = <span className="flex flex-col text-xs">{errors}</span>;
	}

	if (Array.isArray(errors)) {
		description = (
			<span className="flex flex-col gap-1 text-xs">
				{errors?.map((error, index) => (
					<span key={index}>{error}</span>
				))}
			</span>
		);
	}

	return toast.add({
		type: 'error',
		title: 'Błąd formularza',
		description,
	});
}

export function successSignUpToast() {
	return toast.add({
		type: 'success',
		title: 'Rejestracja zakończona sukcesem',
		description: 'Twoje konto zostało pomyślnie utworzone.',
	});
}

export function successSignInToast() {
	return toast.add({
		type: 'success',
		title: 'Logowanie zakończone sukcesem',
		description: 'Zostałeś pomyślnie zalogowany.',
	});
}
