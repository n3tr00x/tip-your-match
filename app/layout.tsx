import { Inter, Roboto } from 'next/font/google';

import type { Metadata, Viewport } from 'next';

import { cn } from '@/lib/utils';

import { ThemeProvider } from '@/components/theme-provider';

import { Toaster } from '@/components/ui/toast';

import './globals.css';

const inter = Inter({
	subsets: ['latin'],
	variable: '--font-heading',
});
const roboto = Roboto({
	subsets: ['latin'],
	variable: '--font-sans',
});

export const viewport: Viewport = { viewportFit: 'cover' };

export const metadata: Metadata = {
	title: {
		template: '%s · Tip Your Match',
		default: 'Tip Your Match',
	},
	description:
		'Typuj wyniki meczów, rywalizuj ze znajomymi w prywatnych ligach i walcz o szczyt rankingu.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html
			lang="pl"
			className={cn('h-full', 'antialiased', roboto.variable, inter.variable, 'font-sans')}
			suppressHydrationWarning
		>
			<body className="flex min-h-full flex-col">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}

					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
