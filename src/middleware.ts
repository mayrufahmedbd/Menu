import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Decodes a JWT payload in an Edge-safe manner without Node.js dependencies
function decodeJwt(token: string) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1];
    
    // Replace base64url characters with base64 characters
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie?.value;

  // Paths requiring protection
  const isAdminPath = pathname.startsWith('/admin');
  const isVendorPath = pathname.startsWith('/vendor');
  const isProfilePath = pathname.startsWith('/profile');
  const isCheckoutPath = pathname.startsWith('/checkout');

  if (isAdminPath || isVendorPath || isProfilePath || isCheckoutPath) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    const payload = decodeJwt(token);

    // If token is invalid or expired
    if (!payload || !payload.role || (payload.exp && Date.now() >= payload.exp * 1000)) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }

    const role = payload.role;

    // Check specific path roles
    if (isAdminPath) {
      if (role !== 'admin' && role !== 'superadmin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    if (isVendorPath) {
      if (role !== 'vendor' && role !== 'admin' && role !== 'superadmin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/vendor/:path*',
    '/profile/:path*',
    '/checkout/:path*',
  ],
};
