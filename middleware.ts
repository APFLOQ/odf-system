import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/", "/market-regimes", "/api"];
const authRoutes = ["/api/auth/login", "/api/auth/callback"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
    return NextResponse.next();
  }

  if (authRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const cookieHeader = request.headers.get("cookie") || "";
  const sessionMatch = cookieHeader.match(/odf_session=([^;]+)/);

  if (!sessionMatch) {
    const loginUrl = new URL("/api/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/module/:path*",
    "/content/:path*",
    "/admin/:path*",
    "/brain/:path*",
    "/brain",
    "/glossary/:path*",
    "/glossary",
  ],
};
