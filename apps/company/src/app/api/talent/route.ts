/**
 * Proxies to the Flask API — keeps the company app's internal /api/talent
 * route working the same as before so components don't need changing.
 */
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/talent`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/talent proxy error:", err);
    return NextResponse.json({ talent: [] });
  }
}
