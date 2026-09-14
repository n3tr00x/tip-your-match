import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

export async function proxy(request: NextRequest) {
	const { pathname } = new URL(request.url);
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session && pathname === '/') {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (
		session &&
		(pathname.startsWith('/login') || pathname.startsWith('/register'))
	) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
