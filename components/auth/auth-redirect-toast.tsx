'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { successSignInToast } from '@/lib/toasts/auth';

export function AuthRedirectToast() {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();
	const hasShown = useRef(false);

	useEffect(() => {
		const isLoginSearchParamIsSucceed = searchParams.get('login') === 'success';

		if (!isLoginSearchParamIsSucceed || hasShown.current) {
			return;
		}

		hasShown.current = true;
		successSignInToast();

		const params = new URLSearchParams(searchParams.toString());
		params.delete('login');
		const query = params.toString();

		router.replace(query ? `${pathname}?${query}` : pathname, {
			scroll: false,
		});
	}, [searchParams, pathname, router]);

	return null;
}
