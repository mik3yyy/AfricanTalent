import { NextResponse } from "next/server";
import { getAllCohorts, createCohort } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

export async function GET() {
  const cohorts = await getAllCohorts();
  return NextResponse.json({ cohorts });
}

export async function POST(req: Request) {
  const body = await req.json() as { name: string; isOpen: boolean; maxSize: number };
  const cohort = await createCohort(body);
  if (!cohort) return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  return NextResponse.json({ cohort }, { status: 201 });
}
