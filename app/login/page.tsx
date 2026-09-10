import { AuthContainer } from '@/components/auth/auth-container';
import { LoginForm } from '@/components/auth/auth-form';

export default function LoginPage() {
	return (
		<AuthContainer>
			<LoginForm />
		</AuthContainer>
	);
}
