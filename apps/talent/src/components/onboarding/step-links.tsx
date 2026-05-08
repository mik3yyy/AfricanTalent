"use client";

import { OnboardingData } from "@/app/(authenticated)/onboarding/page";

function isLinkedInUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return (
      u.hostname === "linkedin.com" ||
      u.hostname === "www.linkedin.com" ||
      u.hostname.endsWith(".linkedin.com")
    );
  } catch {
    return false;
  }
}

function isOptionalUrl(url: string): boolean {
  if (!url.trim()) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const inputClass =
  "flex-1 px-3 py-2.5 rounded-lg bg-white/[0.06] border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/[0.08] transition-colors";

interface StepLinksProps {
  data: OnboardingData;
  onChange: (patch: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepLinks({ data, onChange, onNext, onBack }: StepLinksProps) {
  const linkedinDirty = data.linkedinUrl.trim().length > 0;
  const linkedinValid = linkedinDirty && isLinkedInUrl(data.linkedinUrl.trim());
  const githubValid = isOptionalUrl(data.githubUrl);
  const websiteValid = isOptionalUrl(data.websiteUrl);

  const isValid = linkedinValid && githubValid && websiteValid;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) onNext();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Links</h2>
        <p className="text-sm text-white/40 mt-1">
          Share your professional presence. LinkedIn is required.
        </p>
      </div>

      {/* LinkedIn — required */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/70">
          LinkedIn URL <span className="text-red-400">*</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0 text-white/40">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </span>
          <input
            type="url"
            required
            placeholder="https://linkedin.com/in/yourprofile"
            value={data.linkedinUrl}
            onChange={(e) => onChange({ linkedinUrl: e.target.value })}
            className={inputClass}
          />
        </div>
        {linkedinDirty && !linkedinValid && (
          <p className="text-xs text-red-400">
            Must be a valid linkedin.com URL (e.g. https://linkedin.com/in/yourprofile)
          </p>
        )}
        {linkedinValid && (
          <p className="text-xs text-white/50">Valid LinkedIn URL</p>
        )}
      </div>

      {/* GitHub — optional */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/70">
          GitHub URL{" "}
          <span className="text-white/30 font-normal">(optional)</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0 text-white/40">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </span>
          <input
            type="url"
            placeholder="https://github.com/yourusername"
            value={data.githubUrl}
            onChange={(e) => onChange({ githubUrl: e.target.value })}
            className={inputClass}
          />
        </div>
        {data.githubUrl.trim() && !githubValid && (
          <p className="text-xs text-red-400">Must be a valid URL</p>
        )}
      </div>

      {/* Personal website — optional */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-white/70">
          Personal Website{" "}
          <span className="text-white/30 font-normal">(optional)</span>
        </label>
        <input
          type="url"
          placeholder="https://yoursite.com"
          value={data.websiteUrl}
          onChange={(e) => onChange({ websiteUrl: e.target.value })}
          className={inputClass.replace("flex-1", "w-full")}
        />
        {data.websiteUrl.trim() && !websiteValid && (
          <p className="text-xs text-red-400">Must be a valid URL</p>
        )}
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
