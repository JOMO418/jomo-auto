import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_token';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page through
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    const secret = process.env.ADMIN_COOKIE_SECRET ?? '';

    if (!token || !token.startsWith(secret)) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
