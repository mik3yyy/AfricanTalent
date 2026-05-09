import { NextResponse } from "next/server";
import { updateCohort, deleteCohort } from "@/lib/admin-db";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json() as Partial<{ name: string; isOpen: boolean; maxSize: number }>;
  const cohort = await updateCohort(Number(params.id), body);
  if (!cohort) return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  return NextResponse.json({ cohort });
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const ok = await deleteCohort(Number(params.id));
  if (!ok) return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
