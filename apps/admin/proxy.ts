import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const isLoggedIn = Boolean(request.cookies.get("auth_token")); // adjust cookie name
  const { pathname } = request.nextUrl;

  // Redirect logged-in users away from /auth/signin
  if (pathname === "/auth/signin" && isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * Match all routes except for:
     * - _next/static (JS, CSS chunks)
     * - _next/image (image optimization)
     * - favicon.ico
     * - robots.txt
     * - sitemap.xml
     * - images/ folder
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|images).*)",
  ],
};
