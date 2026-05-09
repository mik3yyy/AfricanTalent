import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

export async function GET() {
  try {
    const res = await fetch(`${API_URL}/api/cohorts/active`, { cache: "no-store" });
    return NextResponse.json(await res.json(), { status: res.status });
  } catch {
    return NextResponse.json(
      { cohort: { name: "Cohort 1", isOpen: false, maxSize: 500, approved: 0, pending: 0 } }
    );
  }
}
