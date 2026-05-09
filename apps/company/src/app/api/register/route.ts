import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
const APP_SECRET = process.env.APP_SECRET ?? "african-talent-app-secret-2026";

export async function POST(req: Request) {
  try {
    const body = await req.json() as Record<string, string>;
    const res = await fetch(`${API_URL}/api/companies/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Secret": APP_SECRET,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}
