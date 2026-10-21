'use client';

import { useEffect, useState } from 'react';
import { CheckIcon, CopyIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { errorCopyCodeToast, successCopyCodeToast } from '@/lib/toasts/leagues';

const COPIED_RESET_MS = 2000;

type CopyCodeButtonProps = {
	code: string;
};

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
	const [isCopied, setIsCopied] = useState(false);

	useEffect(() => {
		if (!isCopied) return;

		const timeout = setTimeout(() => setIsCopied(false), COPIED_RESET_MS);

		return () => clearTimeout(timeout);
	}, [isCopied]);

	const copyCodeHandler = async () => {
		if (!navigator.clipboard) {
			errorCopyCodeToast();
			return;
		}

		try {
			await navigator.clipboard.writeText(code);
			setIsCopied(true);
			successCopyCodeToast(code);
		} catch {
			errorCopyCodeToast();
		}
	};

	return (
		<Button
			aria-label="Kopiuj kod ligi"
			type="button"
			variant="outline"
			size="icon-sm"
			onClick={copyCodeHandler}
		>
			{isCopied ? <CheckIcon aria-hidden /> : <CopyIcon aria-hidden />}
		</Button>
	);
}
