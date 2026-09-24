import { MobileNavbar } from '@/components/mobile-navbar';
import { Navbar } from '@/components/navbar';

export default function AppLayout({ children }: LayoutProps<'/'>) {
	return (
		<>
			<Navbar />
			<MobileNavbar />
			<main className="container mx-auto px-6 pb-20 md:pb-0">{children}</main>
		</>
	);
}
