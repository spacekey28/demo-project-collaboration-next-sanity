import { NextResponse } from "next/server";

/**
 * API route to enable Next.js preview mode for viewing draft Sanity content
 *
 * Usage:
 * - From Sanity Studio: Configure preview URL with secret token
 * - Example: /api/preview?secret=YOUR_SECRET&slug=blog/my-post
 *
 * The secret should be stored in environment variables for security
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // const secret = searchParams.get("secret"); // For future secret validation
  const slug = searchParams.get("slug");

  // Validate secret token (optional but recommended for security)
  // You can add a SANITY_PREVIEW_SECRET env variable if needed
  // const expectedSecret = process.env.SANITY_PREVIEW_SECRET;
  // if (secret !== expectedSecret) {
  //   return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  // }

  // Enable preview mode by setting the preview cookie
  // Redirect to the requested page or home page
  const redirectUrl = slug ? `/${slug}` : "/";
  const response = NextResponse.redirect(new URL(redirectUrl, request.url));

  response.cookies.set("__prerender_bypass", "true", {
    httpOnly: true,
    sameSite: "none",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });

  return response;
}
