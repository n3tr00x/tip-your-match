import { toast } from '@/components/ui/toast';

export function successCopyCodeToast(code: string) {
	return toast.add({
		type: 'success',
		title: `Skopiowano kod ligi`,
		description: code,
	});
}

export function errorCopyCodeToast() {
	return toast.add({
		type: 'error',
		title: 'Nie udało się skopiować kodu ligi',
		description: 'Zaznacz kod i skopiuj go ręcznie',
	});
}
