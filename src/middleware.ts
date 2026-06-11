import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { BASE_PATH } from '@/lib/base-path';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const AUTH_PASSWORD = process.env.GATEKEEPER_PASSWORD || "d1073741824@L";

  const loginPath = `${BASE_PATH}/login`;
  const resourcesPath = `${BASE_PATH}/resources`;

  if (
    pathname === loginPath ||
    pathname.startsWith(`${loginPath}/`) ||
    pathname.startsWith(`${BASE_PATH}/_next`) ||
    pathname.startsWith(resourcesPath) ||
    pathname === `${BASE_PATH}/favicon.ico`
  ) {
    return NextResponse.next();
  }

  const isAuthenticated = request.cookies.get('app_session')?.value === AUTH_PASSWORD;

  if (!isAuthenticated) {
    const loginUrl = new URL(loginPath, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/demo/point-of-sale-resto/:path*",
};
