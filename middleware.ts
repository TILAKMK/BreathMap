import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Pass through all requests - Next.js will handle routing
  return NextResponse.next();
}

// Only run middleware on specific paths if needed
export const config = {
  matcher: [
    // Skip middleware for static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)',
  ],
};
