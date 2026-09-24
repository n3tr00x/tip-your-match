import { CalendarDaysIcon, TargetIcon, TrophyIcon, UsersIcon } from 'lucide-react';

export const navLinks = [
	{ href: '/predictions', label: 'Typuj', icon: TargetIcon },
	{ href: '/schedule', label: 'Terminarz', icon: CalendarDaysIcon },
	{ href: '/ranking', label: 'Ranking', icon: TrophyIcon },
	{ href: '/leagues', label: 'Ligi', icon: UsersIcon },
];

export function isLinkActive(pathname: string, href: string) {
	return pathname === href || pathname.startsWith(`${href}/`);
}
