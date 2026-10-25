import { toast } from '@/components/ui/toast';

export function successProfileToast() {
	return toast.add({
		type: 'success',
		title: 'Zapisano profil',
	});
}
