import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

const PUBLIC_PATHS = ['/login', '/register'];

export async function proxy(request: NextRequest) {
	const { pathname } = new URL(request.url);
	const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session && !isPublicPath) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	if (session && isPublicPath) {
		return NextResponse.redirect(new URL('/', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
