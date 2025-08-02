import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const session = req.cookies.get('appwrite-session')?.value;
  const { pathname } = req.nextUrl;

  const isLogin = pathname === '/login';

  if (isLogin && session) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!session && !isLogin) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images/|assets/|fonts/).*)',
  ],
};
