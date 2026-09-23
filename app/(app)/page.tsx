import { Suspense } from 'react';
import { AuthRedirectToast } from '@/components/auth/auth-redirect-toast';

export default function Home() {
	return (
		<div className="flex justify-center h-[3000px]">
			<Suspense>
				<AuthRedirectToast />
			</Suspense>
		</div>
	);
}
