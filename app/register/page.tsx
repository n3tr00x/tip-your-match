import { AuthContainer } from '@/components/auth/auth-container';
import { RegisterForm } from '@/components/auth/auth-form';

export default function RegisterPage() {
	return (
		<AuthContainer>
			<RegisterForm />
		</AuthContainer>
	);
}
