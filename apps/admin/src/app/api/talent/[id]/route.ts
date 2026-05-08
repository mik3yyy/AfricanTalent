import { NextResponse } from "next/server";
import { updateTalentStatus } from "@/lib/admin-db";
import type { ApplicationStatus } from "@/lib/admin-db";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json() as { status: ApplicationStatus; notes?: string; rejectionReason?: string };
    if (!body.status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }
    await updateTalentStatus(params.id, body.status, body.notes, body.rejectionReason);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update talent" }, { status: 500 });
  }
}
