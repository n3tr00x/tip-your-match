'use client';

import { AuthRedirectToast } from '@/components/auth/auth-redirect-toast';
import { Suspense } from 'react';

export default function Home() {
	return (
		<div className="flex justify-center h-[3000px]">
			<Suspense>
				<AuthRedirectToast />
			</Suspense>
		</div>
	);
}
