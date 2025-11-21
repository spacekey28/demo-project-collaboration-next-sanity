import { NextResponse } from "next/server";

/**
 * API route to disable Next.js preview mode
 *
 * Usage:
 * - Redirect users here to exit preview mode
 * - Example: /api/exit-preview
 */
export async function GET(request: Request) {
  // Get the referrer to redirect back, or go to home page
  const referrer = request.headers.get("referer");
  const redirectUrl = referrer || "/";

  // Disable preview mode by deleting the preview cookie
  const response = NextResponse.redirect(new URL(redirectUrl, request.url));
  response.cookies.delete("__prerender_bypass");

  return response;
}
