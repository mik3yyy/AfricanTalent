"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ChevronRight, Plus, Trash2 } from "lucide-react";

type WhoType = "founder" | "recruiter" | "developer" | "designer" | "investor" | "other";

const WHO_OPTIONS: { value: WhoType; label: string; emoji: string }[] = [
  { value: "founder", label: "Founder", emoji: "🚀" },
  { value: "recruiter", label: "Recruiter / HR", emoji: "🎯" },
  { value: "developer", label: "Developer", emoji: "💻" },
  { value: "designer", label: "Designer", emoji: "🎨" },
  { value: "investor", label: "Investor", emoji: "💼" },
  { value: "other", label: "Other", emoji: "✦" },
];

const COMPANY_SIZES = ["1–10", "11–50", "51–200", "200–1000", "1000+"];

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Germany", "France", "Netherlands",
  "Sweden", "Australia", "Singapore", "UAE", "Nigeria", "Kenya", "Ghana", "South Africa",
  "Rwanda", "Ethiopia", "Egypt", "Tanzania", "Uganda", "Other",
];

type LinkField = { label: string; value: string };

const DEFAULT_LINKS: LinkField[] = [
  { label: "LinkedIn", value: "" },
  { label: "GitHub", value: "" },
  { label: "Website", value: "" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Step 0 — who you are
  const [who, setWho] = useState<WhoType | "">("");
  const [whoOther, setWhoOther] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companySize, setCompanySize] = useState("");

  // Step 1 — location
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  // Step 2 — links
  const [links, setLinks] = useState<LinkField[]>(DEFAULT_LINKS);

  const showCompany = who === "founder" || who === "recruiter" || who === "investor";

  const step0Valid = who !== "" && (who !== "other" || whoOther.trim().length > 0);
  const step1Valid = country !== "";

  const addLink = () => setLinks((l) => [...l, { label: "", value: "" }]);
  const updateLink = (i: number, patch: Partial<LinkField>) =>
    setLinks((l) => l.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  const removeLink = (i: number) => setLinks((l) => l.filter((_, idx) => idx !== i));

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      const supabase = createClient();
      const linksMap: Record<string, string> = {};
      links.forEach(({ label, value }) => {
        if (label.trim() && value.trim()) linksMap[label.toLowerCase()] = value.trim();
      });

      await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          viewer_profile: {
            who: who === "other" ? whoOther.trim() : who,
            companyName: showCompany ? companyName : undefined,
            companySize: showCompany ? companySize : undefined,
            country,
            city,
            links: linksMap,
          },
        },
      });

      router.push("/search");
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#050505" }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-white font-bold text-sm border mb-4"
            style={{ backgroundColor: "rgba(255,255,255,0.08)", borderColor: "rgba(255,255,255,0.20)" }}
          >
            AT
          </div>
          <h1 className="text-2xl font-bold text-white">Tell us about yourself</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>
            Step {step + 1} of 3
          </p>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 h-0.5 rounded-full transition-all"
              style={{
                backgroundColor: i <= step ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.12)",
              }}
            />
          ))}
        </div>

        {/* Step 0 — Who are you? */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Who are you?</h2>
            <div className="grid grid-cols-2 gap-2">
              {WHO_OPTIONS.map(({ value, label, emoji }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setWho(value)}
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left transition-all"
                  style={{
                    backgroundColor: who === value ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.03)",
                    borderColor: who === value ? "rgba(255,255,255,0.40)" : "rgba(255,255,255,0.08)",
                    color: who === value ? "#ffffff" : "rgba(255,255,255,0.55)",
                  }}
                >
                  <span className="text-lg">{emoji}</span>
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>

            {who === "other" && (
              <input
                value={whoOther}
                onChange={(e) => setWhoOther(e.target.value)}
                placeholder="Tell us what you do…"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              />
            )}

            {showCompany && (
              <div className="space-y-3 pt-2">
                <p className="text-sm font-medium text-white/60">Company (optional)</p>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company name"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                />
                <div className="flex flex-wrap gap-2">
                  {COMPANY_SIZES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setCompanySize(s)}
                      className="px-3 py-1.5 rounded-lg text-xs border transition-all"
                      style={{
                        backgroundColor: companySize === s ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.03)",
                        borderColor: companySize === s ? "rgba(255,255,255,0.40)" : "rgba(255,255,255,0.08)",
                        color: companySize === s ? "#ffffff" : "rgba(255,255,255,0.50)",
                      }}
                    >
                      {s} people
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => setStep(1)}
              disabled={!step0Valid}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all mt-4"
              style={{
                backgroundColor: step0Valid ? "#ffffff" : "rgba(255,255,255,0.10)",
                color: step0Valid ? "#050505" : "rgba(255,255,255,0.30)",
              }}
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 1 — Location */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white mb-4">Where are you based?</h2>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none appearance-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: country ? "#ffffff" : "rgba(255,255,255,0.35)",
              }}
            >
              <option value="" disabled>Select country…</option>
              {COUNTRIES.map((c) => (
                <option key={c} value={c} style={{ backgroundColor: "#141414", color: "#fff" }}>{c}</option>
              ))}
            </select>

            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="City (optional)"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-white/30 outline-none"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(0)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.50)",
                }}
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                disabled={!step1Valid}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: step1Valid ? "#ffffff" : "rgba(255,255,255,0.10)",
                  color: step1Valid ? "#050505" : "rgba(255,255,255,0.30)",
                }}
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Links */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-white">Add your links</h2>
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.40)" }}>
                LinkedIn, GitHub, website — anything that tells us who you are. All optional.
              </p>
            </div>

            <div className="space-y-3">
              {links.map((link, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={link.label}
                    onChange={(e) => updateLink(i, { label: e.target.value })}
                    placeholder="Label"
                    className="w-24 flex-shrink-0 px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  />
                  <input
                    value={link.value}
                    onChange={(e) => updateLink(i, { value: e.target.value })}
                    placeholder="https://…"
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white placeholder-white/30 outline-none"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                    }}
                  />
                  {i >= 3 && (
                    <button
                      onClick={() => removeLink(i)}
                      className="p-2 rounded-lg"
                      style={{ color: "rgba(255,255,255,0.30)" }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}

              <button
                onClick={addLink}
                className="flex items-center gap-1.5 text-sm px-3 py-2"
                style={{ color: "rgba(255,255,255,0.40)" }}
              >
                <Plus className="w-3.5 h-3.5" /> Add another link
              </button>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold border transition-all"
                style={{
                  backgroundColor: "transparent",
                  borderColor: "rgba(255,255,255,0.12)",
                  color: "rgba(255,255,255,0.50)",
                }}
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{ backgroundColor: "#ffffff", color: "#050505" }}
              >
                {submitting ? "Setting up…" : "Browse Talent →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
