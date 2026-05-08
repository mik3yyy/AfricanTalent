import { NextResponse } from "next/server";
import { getAllCompanies } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const companies = await getAllCompanies();
    return NextResponse.json({ companies });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}
