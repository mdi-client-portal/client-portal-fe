import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const sessionToken = request.cookies.get("access_token")?.value;

  if (pathname === "/login" && sessionToken) {
    const dashboardUrl = new URL("/", request.nextUrl.origin);
    return NextResponse.redirect(dashboardUrl);
  }

  if (pathname === "/login" && !sessionToken) {
    return NextResponse.next();
  }

  if (!sessionToken) {
    const loginUrl = new URL("/login", request.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/invoices/:path*",
    "/payments/:path*",
  ],
};
