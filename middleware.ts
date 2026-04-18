import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname.includes("favicon") || pathname.includes("sitemap")) {
    return NextResponse.next();
  }
  
  if (pathname === "/login" || pathname === "/register" || pathname === "/") {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|sitemap.xml).*)"],
};