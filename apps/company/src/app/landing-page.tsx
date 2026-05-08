"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { mockTalent } from "@/lib/mock-data";

export function LandingPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: "offline", prompt: "consent" },
        },
      });
      if (error) {
        toast.error("Sign-in failed. Please try again.");
        setLoading(false);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const portraits = mockTalent.slice(0, 12).map((t) => t.profilePhotoUrl);

  return (
    <div className="min-h-screen overflow-hidden" style={{ backgroundColor: "#050505" }}>
      {/* Nav */}
      <nav
        className="fixed top-0 z-50 w-full flex items-center justify-between px-6 py-4"
        style={{ background: "linear-gradient(to bottom, rgba(5,5,5,0.95) 0%, transparent 100%)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm border"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.20)" }}
          >
            AT
          </div>
          <span className="font-bold text-white text-lg tracking-tight">AfriTalent</span>
        </div>
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-black bg-white hover:bg-white/90 transition-all disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </nav>

      {/* Hero */}
      <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Background portrait mosaic */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 grid grid-cols-4 sm:grid-cols-6 gap-1 opacity-30 rotate-3 scale-110">
            {[...portraits, ...portraits, ...portraits].map((url, i) => (
              <div
                key={i}
                className="aspect-[3/4] overflow-hidden"
                style={{ borderRadius: "6px" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* Dark vignette overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(5,5,5,0.3) 0%, rgba(5,5,5,0.85) 60%, #050505 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 text-xs font-medium rounded-full"
            style={{
              backgroundColor: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.60)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: "rgba(255,255,255,0.80)" }}
            />
            Cohort 1 · Applications open
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            The Netflix
            <br />
            <span style={{ color: "rgba(255,255,255,0.55)" }}>for African Talent</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.50)" }}>
            Browse a curated roster of exceptional African professionals — pre-vetted, ready to work, and looking for global teams.
          </p>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="px-10 py-4 rounded-xl text-base font-bold text-black bg-white hover:bg-white/90 transition-all disabled:opacity-60 shadow-2xl"
          >
            {loading ? "Loading…" : "Browse Talent — It's Free"}
          </button>

          <div
            className="flex flex-wrap items-center justify-center gap-4 mt-8 text-sm"
            style={{ color: "rgba(255,255,255,0.30)" }}
          >
            {["Founders", "Recruiters", "Dev Teams", "Designers", "Anyone"].map((who, i) => (
              <span key={who} className="flex items-center gap-4">
                {who}
                {i < 4 && <span style={{ color: "rgba(255,255,255,0.15)" }}>·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #050505)" }}
        />
      </div>
    </div>
  );
}
