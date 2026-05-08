import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1).optional(),
  role: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = schema.parse(body);

    // TODO: Save to Supabase waitlist_entries table
    // For now, just log and return success
    console.log("Waitlist signup:", data);

    // TODO: Add to ConvertKit via CONVERTKIT_API_KEY + CONVERTKIT_FORM_ID
    // await addToConvertKit(data.email, data.firstName, data.role);

    return NextResponse.json({ success: true, message: "You're on the list!" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid request" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
