import { ReactNode } from 'react';

type AuthContainerProps = {
	children: ReactNode;
};

export function AuthContainer({ children }: AuthContainerProps) {
	return (
		<main className="flex min-h-screen items-center justify-center p-6">
			{children}
		</main>
	);
}
