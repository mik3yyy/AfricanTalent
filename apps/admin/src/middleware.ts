import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED = ["/dashboard", "/applications", "/members", "/companies", "/cohorts", "/waitlist", "/analytics"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED.some(
    (r) => pathname === r || pathname.startsWith(r + "/")
  );

  // Without real Supabase, allow all admin routes through for development
  if (isProtected && !user && process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder") === false) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webch)$).*)",
  ],
};
