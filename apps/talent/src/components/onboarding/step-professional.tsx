"use client";

import { cn } from "@/lib/utils";
import { OnboardingData } from "@/app/(authenticated)/onboarding/page";

const SECTORS = [
  { value: "software_engineering", label: "Software Engineering" },
  { value: "mobile_development", label: "Mobile Development" },
  { value: "web_development", label: "Web Development" },
  { value: "vibe_coding", label: "Vibe Coding" },
  { value: "product_management", label: "Product Management" },
  { value: "design_ux", label: "Design / UX" },
  { value: "data_analytics", label: "Data & Analytics" },
  { value: "ai_ml", label: "AI / Machine Learning" },
  { value: "devops_infrastructure", label: "DevOps / Infrastructure" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "marketing", label: "Marketing" },
  { value: "sales", label: "Sales" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "other", label: "Other" },
];

const BIO_MIN = 100;
const BIO_MAX = 1000;

const inputClass =
  "w-full px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/[0.08] transition-colors";

interface StepProfessionalProps {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepProfessional({ data, onChange, onNext, onBack }: StepProfessionalProps) {
  const bioLength = data.bio.trim().length;
  const bioValid = bioLength >= BIO_MIN && bioLength <= BIO_MAX;
  const isValid = data.sectors.length > 0 && bioValid;

  function toggleSector(value: string) {
    const current = data.sectors;
    if (current.includes(value)) {
      onChange({ sectors: current.filter((s) => s !== value) });
    } else {
      onChange({ sectors: [...current, value] });
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Professional Details</h2>
        <p className="text-sm text-white/40 mt-1">
          Tell companies about your expertise. Select all that apply.
        </p>
      </div>

      {/* Sectors — multi-select toggles */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-white/70">
          Sector(s) <span className="text-red-400">*</span>
          <span className="text-white/30 font-normal ml-1">(select all that apply)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {SECTORS.map((s) => {
            const selected = data.sectors.includes(s.value);
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => toggleSector(s.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150",
                  selected
                    ? "bg-white text-black border-white"
                    : "bg-white/[0.04] text-white/60 border-white/10 hover:bg-white/[0.08] hover:text-white/80"
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        {data.sectors.length === 0 && (
          <p className="text-xs text-white/30">Select at least one sector.</p>
        )}
      </div>

      {/* Bio */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/70">
          Professional Bio <span className="text-red-400">*</span>
        </label>
        <textarea
          required
          rows={7}
          placeholder="Write a compelling summary of your background, what you've built, and what makes you stand out. Be specific about your experience, projects, and impact. Companies read this carefully."
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          className={inputClass + " resize-none"}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/30">
            {BIO_MIN}–{BIO_MAX} characters. Be specific about your impact.
          </p>
          <span
            className={cn(
              "text-xs",
              bioLength === 0
                ? "text-white/20"
                : bioValid
                ? "text-white/60"
                : bioLength > BIO_MAX
                ? "text-red-400"
                : "text-white/50"
            )}
          >
            {bioLength} / {BIO_MAX}
          </span>
        </div>
        {!bioValid && bioLength > 0 && bioLength < BIO_MIN && (
          <p className="text-xs text-white/50">
            {BIO_MIN - bioLength} more character{BIO_MIN - bioLength !== 1 ? "s" : ""} needed
          </p>
        )}
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-lg border border-white/20 text-white/50 hover:bg-white/[0.06] font-medium text-sm transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className="px-6 py-2.5 rounded-lg bg-white hover:bg-white/90 disabled:bg-white/10 disabled:text-white/30 text-black font-medium text-sm transition-colors"
        >
          Next
        </button>
      </div>
    </form>
  );
}
