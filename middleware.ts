import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET ?? "MaFondationSecurisee2026!@#SuperSecret";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname.includes("favicon") || pathname.includes("sitemap")) {
    return NextResponse.next();
  }
  
  if (pathname === "/login" || pathname === "/register" || pathname === "/") {
    return NextResponse.next();
  }
  
  const token = await getToken({ req: request, secret });

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};