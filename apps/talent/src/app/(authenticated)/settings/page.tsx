"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) setEmail(user.email);
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 mt-1 text-sm">
          Manage your account and subscription
        </p>
      </div>

      {/* Account */}
      <section className="glass-card rounded-2xl p-6">
        <p className="text-xs uppercase tracking-wider text-white/30 mb-4">
          Account
        </p>
        <div className="mb-6">
          <p className="text-xs text-white/40 mb-0.5">Signed in with</p>
          <p className="text-sm text-white/70 font-medium">Google</p>
        </div>
        <div className="mb-6">
          <p className="text-xs text-white/40 mb-0.5">Email address</p>
          <p className="text-sm text-white font-medium">
            {loading ? (
              <span className="inline-block w-40 h-4 bg-white/[0.06] rounded animate-pulse" />
            ) : (
              email || "—"
            )}
          </p>
        </div>

        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white/60 hover:bg-white/[0.08] hover:text-white text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-4 h-4" />
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </section>

      {/* Subscription */}
      <section className="glass-card rounded-2xl p-6">
        <p className="text-xs uppercase tracking-wider text-white/30 mb-4">
          Subscription
        </p>
        <div className="mb-4">
          <p className="text-white font-semibold text-lg">Standard plan</p>
          <p className="text-white/40 text-sm mt-1">
            $15/month — currently active
          </p>
        </div>
        <div className="pt-4 border-t border-white/[0.06]">
          <p className="text-white/50 text-sm leading-relaxed">
            Payments are processed manually for now. To upgrade to the Featured
            plan ($25/month) — which includes priority search ranking and a
            highlighted profile badge — email{" "}
            <a
              href="mailto:support@afritalent.com"
              className="text-white/70 underline hover:text-white"
            >
              support@afritalent.com
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
