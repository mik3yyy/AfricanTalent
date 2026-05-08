"use client";

import { cn } from "@/lib/utils";
import { OnboardingData } from "@/app/(authenticated)/onboarding/page";
import { COMPENSATION_RANGE } from "@platform/config";

interface StepCompensationProps {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function StepCompensation({
  data,
  onChange,
  onBack,
  onSubmit,
  submitting,
}: StepCompensationProps) {
  const countryLabel = data.countryName || "your country";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (data.compensationAccepted) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Compensation Guidelines</h2>
        <p className="text-sm text-white/40 mt-1">
          Review the platform compensation range before submitting.
        </p>
      </div>

      {/* Range display card */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
        <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
          Monthly Range (USD) — Platform Standard
        </p>
        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-3xl font-bold text-white">
            ${COMPENSATION_RANGE.min.toLocaleString()}
          </span>
          <span className="text-white/40 text-lg">–</span>
          <span className="text-3xl font-bold text-white">
            ${COMPENSATION_RANGE.max.toLocaleString()}
          </span>
          <span className="text-white/40 text-sm ml-1">/ month</span>
        </div>

        {/* Visual bar */}
        <div className="mt-4 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full w-full rounded-full bg-white/30" />
        </div>

        <p className="text-sm text-white/40 mt-4 leading-relaxed">
          These rates represent strong pay by African standards, while remaining
          cost-effective for global companies. Accepting these guidelines is
          required to join the platform.
        </p>
      </div>

      {/* Acceptance checkbox */}
      <button
        type="button"
        onClick={() =>
          onChange({ compensationAccepted: !data.compensationAccepted })
        }
        className={cn(
          "w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all duration-200",
          data.compensationAccepted
            ? "border-white/60 bg-white/10"
            : "border-white/10 bg-white/[0.03] hover:border-white/20"
        )}
      >
        <div
          className={cn(
            "mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-colors",
            data.compensationAccepted
              ? "border-white bg-white"
              : "border-white/20 bg-transparent"
          )}
        >
          {data.compensationAccepted && (
            <svg
              className="w-3 h-3 text-black"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2,6 5,9 10,3" />
            </svg>
          )}
        </div>
        <p className="text-sm text-white/60 leading-relaxed">
          I accept the platform compensation guidelines (
          <span className="text-white font-medium">
            ${COMPENSATION_RANGE.min.toLocaleString()}–${COMPENSATION_RANGE.max.toLocaleString()} / month
          </span>
          ) and understand that my compensation will be within this range.
        </p>
      </button>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="px-5 py-2.5 rounded-lg border border-white/20 text-white/50 hover:bg-white/[0.06] disabled:opacity-50 font-medium text-sm transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={!data.compensationAccepted || submitting}
          className="px-6 py-2.5 rounded-lg bg-white hover:bg-white/90 disabled:bg-white/10 disabled:text-white/30 text-black font-medium text-sm transition-colors flex items-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Submitting...
            </>
          ) : (
            "Submit Application"
          )}
        </button>
      </div>
    </form>
  );
}
