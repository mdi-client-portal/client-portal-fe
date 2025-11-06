import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if user has session token
  const sessionToken = request.cookies.get("access_token")?.value;

  // If user already logged in and trying to access login, redirect to dashboard
  if (pathname === "/login" && sessionToken) {
    const dashboardUrl = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  // Allow login page without authentication
  if (pathname === "/login" && !sessionToken) {
    return NextResponse.next();
  }

  // If no session token, redirect to login
  if (!sessionToken) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  // Allow access if session token exists
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect these routes
    "/",
    "/login",
    "/invoices/:path*",
    "/payments/:path*",
  ],
};
