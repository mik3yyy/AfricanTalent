import { type NextRequest, NextResponse } from "next/server";

const PROTECTED = ["/dashboard", "/applications", "/members", "/viewers", "/cohorts", "/waitlist", "/analytics"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const token = request.cookies.get("admin_token")?.value;

  const isProtected = PROTECTED.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Redirect away from login if already authenticated
  if (pathname === "/" && token) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
