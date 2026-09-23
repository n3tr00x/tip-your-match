import { Navbar } from '@/components/navbar';

export default function AppLayout({ children }: LayoutProps<'/'>) {
	return (
		<>
			<Navbar />
			<main className="container mx-auto px-6">{children}</main>
		</>
	);
}
