import { NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export async function POST(req: Request) {
  const { email, password } = await req.json() as { email: string; password: string };

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const data = await res.json() as { token?: string; error?: string; user?: { role?: string } };

  if (!res.ok || !data.token) {
    return NextResponse.json({ error: data.error ?? "Invalid credentials" }, { status: 401 });
  }

  if (data.user?.role !== "admin") {
    return NextResponse.json({ error: "Admin access only" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("admin_token", data.token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
