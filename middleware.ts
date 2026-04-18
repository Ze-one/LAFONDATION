import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET ?? "MaFondationSecurisee2026!@#SuperSecret";

const publicPaths = ["/", "/login", "/register", "/api/auth", "/_next", "/favicon.ico", "/sitemap.xml"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname === "/favicon.ico" || pathname === "/sitemap.xml") {
    return NextResponse.next();
  }
  
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  const token = await getToken({ req: request, secret });

  if (!token) {
    if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  } else if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
