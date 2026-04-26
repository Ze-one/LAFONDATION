import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { nextAuthSecret } from "@/lib/auth-secret";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname.includes("favicon") || pathname.includes("sitemap")) {
    return NextResponse.next();
  }
  
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return NextResponse.next();
  }
  
  if (pathname === "/api/auth/callback/credentials") {
    return NextResponse.next();
  }
  
  const token = await getToken({ req: request, secret: nextAuthSecret });

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|sitemap.xml).*)"],
};