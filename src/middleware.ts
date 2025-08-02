import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const sessionCookieName = `appwrite-session`;
  const session = req.cookies.get(sessionCookieName)?.value;

  const { pathname } = req.nextUrl;

  const isLogin = pathname === '/login';
  const isPublicAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/images');

  // Allow public assets
  if (isPublicAsset) return NextResponse.next();

  // ✅ If logged in and visiting /login, redirect to dashboard
  if (isLogin && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // ✅ If not logged in and visiting any other page, redirect to login
  if (!session && !isLogin) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|logo.png|public|login).*)',
  ],
};