import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define the password (In production, put this in Vercel Env Variables)
  const AUTH_PASSWORD = process.env.GATEKEEPER_PASSWORD || "d1073741824@L";
  
  // 2. Allow access to the login page and static assets/images
  if (
    pathname.startsWith('/login') || 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/resources') || // Your logo folder
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 3. Check for the session cookie
  const isAuthenticated = request.cookies.get('app_session')?.value === AUTH_PASSWORD;

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Ensure the middleware runs on all routes
export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};