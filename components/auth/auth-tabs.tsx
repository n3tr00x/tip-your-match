import { cn } from 'cn';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function AuthTabs() {
	const pathname = usePathname();
	const isLogin = pathname === '/login';
	const isRegister = pathname === '/register';

	return (
		<div className="mb-4 grid w-full grid-cols-2  bg-card p-2">
			<Link
				href="/login"
				className={cn(
					'p-2 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50',
					{ 'bg-muted': isLogin },
				)}
			>
				Logowanie
			</Link>
			<Link
				href="/register"
				className={cn(
					'p-2 text-center text-sm font-medium text-muted-foreground transition-colors hover:bg-muted/50',
					{ 'bg-muted': isRegister },
				)}
			>
				Rejestracja
			</Link>
		</div>
	);
}
