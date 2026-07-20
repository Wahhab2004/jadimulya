import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { ADMIN_ACCESS_TOKEN_COOKIE, hasAdminAccessToken } from '@/lib/admin-auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ADMIN_ACCESS_TOKEN_COOKIE)?.value;
  const isAuthenticated = hasAdminAccessToken(accessToken);

  if (pathname === '/admin/login') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};