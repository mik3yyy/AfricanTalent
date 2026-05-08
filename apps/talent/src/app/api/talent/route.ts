import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
const APP_SECRET = process.env.APP_SECRET ?? "african-talent-app-secret-2026";

/** GET /api/talent?email=... — look up pre-loaded profile by email */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email") ?? "";
    const res = await fetch(`${API_URL}/api/talent?email=${encodeURIComponent(email)}`, {
      cache: "no-store",
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch (err) {
    console.error("GET /api/talent error:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}

/** POST /api/talent — submit onboarding profile to Flask via app secret */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const res = await fetch(`${API_URL}/api/talent/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Secret": APP_SECRET,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch (err) {
    console.error("POST /api/talent error:", err);
    return NextResponse.json({ error: "Failed to submit profile" }, { status: 500 });
  }
}
