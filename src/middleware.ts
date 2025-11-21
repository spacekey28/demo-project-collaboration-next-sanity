import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check if preview mode is enabled (optional, for future use)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isPreview = request.cookies.has("__prerender_bypass");

  // Allow preview mode to work by passing through the request
  // Preview mode cookie is set by /api/preview route
  // and checked by pages using getClient() from '@/lib/sanity/client'

  // You can add additional logic here if needed, such as:
  // - Restricting preview mode to authenticated users
  // - Adding custom headers for preview content
  // - Redirecting preview requests

  return NextResponse.next();
}

export const config = {
  // Match all request paths except for the ones starting with:
  // - api (API routes)
  // - _next/static (static files)
  // - _next/image (image optimization files)
  // - favicon.ico (favicon file)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
