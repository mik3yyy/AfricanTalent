import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY!;
const COHORT_PERIOD_DAYS = 90;

export async function POST(request: NextRequest) {
  // Verify auth
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll(), setAll: () => {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reference } = await request.json() as { reference?: string };
  if (!reference) {
    return NextResponse.json({ error: "Missing payment reference" }, { status: 400 });
  }

  if (!PAYSTACK_SECRET) {
    return NextResponse.json({ error: "Payment system not configured" }, { status: 500 });
  }

  // Verify with Paystack
  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET}`,
    },
  });

  const json = await res.json() as {
    status: boolean;
    data?: { status: string; amount: number; currency: string; customer: { email: string } };
    message?: string;
  };

  if (!res.ok || !json.status || json.data?.status !== "success") {
    return NextResponse.json(
      { error: json.message ?? "Payment verification failed" },
      { status: 400 }
    );
  }

  // Calculate cohort period
  const activeSince = new Date();
  const expiresAt = new Date(activeSince);
  expiresAt.setDate(expiresAt.getDate() + COHORT_PERIOD_DAYS);

  // Update user metadata using service role to bypass auth update limits
  const adminSupabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  const { error } = await adminSupabase.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...user.user_metadata,
      application_status: "active",
      payment_reference: reference,
      active_since: activeSince.toISOString(),
      expires_at: expiresAt.toISOString(),
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    activeSince: activeSince.toISOString(),
    expiresAt: expiresAt.toISOString(),
  });
}
