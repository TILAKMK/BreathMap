import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Ensure all requests are properly routed
  const { pathname } = request.nextUrl;

  // Allow all routes - Next.js will handle 404s naturally
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files and api routes
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
