import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/onboarding",
  "/profile",
  "/settings",
];

const PUBLIC_ONLY_ROUTES = ["/"];

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const pathname = request.nextUrl.pathname;

  const isProtected = PROTECTED_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  const isPublicOnly = PUBLIC_ONLY_ROUTES.includes(pathname);

  // If accessing a protected route without auth, redirect to home
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // If authenticated user hits the landing page, redirect to dashboard
  if (isPublicOnly && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Enforce onboarding: authenticated users who haven't completed it must go to /onboarding
  // API routes are excluded so file uploads work mid-onboarding
  if (
    user &&
    user.user_metadata?.onboarding_completed !== true &&
    pathname !== "/onboarding" &&
    !pathname.startsWith("/onboarding/") &&
    !pathname.startsWith("/api/")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/onboarding";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
