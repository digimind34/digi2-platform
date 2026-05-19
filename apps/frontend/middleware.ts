import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the base paths and exact paths that should be protected.
const protectedPrefixes = ["/dashboard", "/settings", "/admin"];
const protectedExactPaths = ["/business/create", "/business/edit"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the current path requires authentication
  const isProtectedPath =
    protectedExactPaths.includes(pathname) ||
    protectedPrefixes.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    );

  if (isProtectedPath) {
    const hasAccessToken = request.cookies.has("access");
    const hasRefreshToken = request.cookies.has("refresh");

    // If neither cookie is present, the user is definitely not authenticated
    if (!hasAccessToken && !hasRefreshToken) {
      const loginUrl = new URL("/login", request.url);
      // Pass the original URL so the login page can redirect them back later
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If the cookies exist, allow the request to proceed.
  // Actual token validation and refresh logic will be handled by the backend and lib/api.ts
  return NextResponse.next();
}

// Optimize the middleware to only run on relevant requests
export const config = {
  matcher: [
    // Match all routes except API endpoints, Next.js static assets, and images
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
