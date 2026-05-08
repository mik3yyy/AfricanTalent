import { NextResponse } from "next/server";
import { getAllTalent } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const talent = await getAllTalent();
    return NextResponse.json({ talent });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch talent" }, { status: 500 });
  }
}
