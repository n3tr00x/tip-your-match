import type { Metadata } from 'next';
import { AuthContainer } from '@/components/auth/auth-container';
import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = { title: 'Logowanie' };

export default function LoginPage() {
	return (
		<AuthContainer>
			<LoginForm />
		</AuthContainer>
	);
}
