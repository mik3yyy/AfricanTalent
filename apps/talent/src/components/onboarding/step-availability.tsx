"use client";

import { cn } from "@/lib/utils";
import { OnboardingData } from "@/app/(authenticated)/onboarding/page";

type EmploymentType = OnboardingData["employmentType"];

const OPTIONS: { value: EmploymentType; label: string; description: string }[] =
  [
    {
      value: "full_time",
      label: "Full-time only",
      description: "I'm looking for a full-time permanent position.",
    },
    {
      value: "contract",
      label: "Contract only",
      description: "I prefer project-based or fixed-term contracts.",
    },
    {
      value: "both",
      label: "Both full-time and contract",
      description: "I'm open to either — the right opportunity matters most.",
    },
  ];

interface StepAvailabilityProps {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepAvailability({
  data,
  onChange,
  onNext,
  onBack,
}: StepAvailabilityProps) {
  const isValid = !!data.employmentType;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Availability</h2>
        <p className="text-sm text-white/40 mt-1">
          What kind of engagement are you open to?
        </p>
      </div>

      <div className="space-y-3">
        {OPTIONS.map((option) => {
          const selected = data.employmentType === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange({ employmentType: option.value })}
              className={cn(
                "w-full text-left p-4 rounded-xl border-2 transition-all duration-200",
                selected
                  ? "border-white bg-white/10"
                  : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Radio indicator */}
                <div
                  className={cn(
                    "mt-0.5 w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors",
                    selected
                      ? "border-white bg-white"
                      : "border-white/20 bg-transparent"
                  )}
                >
                  {selected && (
                    <div className="w-2 h-2 rounded-full bg-black" />
                  )}
                </div>
                <div>
                  <p
                    className={cn(
                      "text-sm font-semibold",
                      selected ? "text-white" : "text-white/60"
                    )}
                  >
                    {option.label}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Nav buttons */}
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
