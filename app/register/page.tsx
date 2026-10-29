import type { Metadata } from 'next';
import { AuthContainer } from '@/components/auth/auth-container';
import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = { title: 'Rejestracja' };

export default function RegisterPage() {
	return (
		<AuthContainer>
			<RegisterForm />
		</AuthContainer>
	);
}
