"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { platformConfig } from "@platform/config";
import { createClient } from "@/lib/supabase/client";
import { StepIndicator } from "@/components/onboarding/step-indicator";
import { StepBasic } from "@/components/onboarding/step-basic";
import { StepProfessional } from "@/components/onboarding/step-professional";
import { StepMedia } from "@/components/onboarding/step-media";
import { StepLinks } from "@/components/onboarding/step-links";
import { StepAvailability } from "@/components/onboarding/step-availability";
import { StepCompensation } from "@/components/onboarding/step-compensation";

export type OnboardingData = {
  fullName: string;
  email: string;
  countryCode: string;
  countryName: string;
  sectors: string[];
  bio: string;
  linkedinUrl: string;
  githubUrl: string;
  websiteUrl: string;
  employmentType: "full_time" | "contract" | "both";
  compensationAccepted: boolean;
  profilePhotoUrl: string;
  coverMediaUrl: string;
  coverMediaType: "image" | "video" | "";
  resumeUrl: string;
};

const STEPS = [
  { label: "Profile" },
  { label: "Professional" },
  { label: "Media" },
  { label: "Links" },
  { label: "Availability" },
  { label: "Compensation" },
];

const initialData: OnboardingData = {
  fullName: "",
  email: "",
  countryCode: "",
  countryName: "",
  sectors: [],
  bio: "",
  linkedinUrl: "",
  githubUrl: "",
  websiteUrl: "",
  employmentType: "both",
  compensationAccepted: false,
  profilePhotoUrl: "",
  coverMediaUrl: "",
  coverMediaType: "",
  resumeUrl: "",
};

type CohortInfo = { name: string; isOpen: boolean; maxSize: number };

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>(initialData);
  const [userId, setUserId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [profileDetected, setProfileDetected] = useState(false);
  const [cohort, setCohort] = useState<CohortInfo>({
    name: platformConfig.cohort.currentNumber ? `Cohort ${platformConfig.cohort.currentNumber}` : "Cohort 1",
    isOpen: platformConfig.features.applicationsOpen,
    maxSize: platformConfig.cohort.maxSize,
  });

  useEffect(() => {
    fetch("/api/cohort")
      .then(r => r.json())
      .then((d: { cohort?: CohortInfo }) => { if (d.cohort) setCohort(d.cohort); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      setUserId(user.id);

      const email = user.email ?? "";
      if (email) setData((prev) => ({ ...prev, email }));
      if (user.user_metadata?.full_name) {
        setData((prev) => ({ ...prev, fullName: prev.fullName || user.user_metadata.full_name }));
      }

      // Check for a pre-loaded profile in Flask matching this email
      if (email) {
        try {
          const res = await fetch(`/api/talent?email=${encodeURIComponent(email)}`);
          const { talent } = await res.json() as { talent?: Array<{
            id: string; name?: string; bio?: string; sectors?: string[];
            portfolioLinks?: { linkedin?: string; github?: string; portfolio?: string };
          }> };
          const existing = talent?.[0];
          if (existing) {
            setProfileDetected(true);
            setData((prev) => ({
              ...prev,
              fullName: prev.fullName || existing.name || "",
              bio: prev.bio || existing.bio || "",
              sectors: existing.sectors?.length ? existing.sectors : prev.sectors,
              linkedinUrl: prev.linkedinUrl || existing.portfolioLinks?.linkedin || "",
              githubUrl: prev.githubUrl || existing.portfolioLinks?.github || "",
              websiteUrl: prev.websiteUrl || existing.portfolioLinks?.portfolio || "",
            }));
          }
        } catch {
          // pre-loading is best-effort
        }
      }
    });
  }, []);

  const updateData = (patch: Partial<OnboardingData>) =>
    setData((prev) => ({ ...prev, ...patch }));

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep((s) => s - 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const supabase = createClient();
      const applicationType = cohort.isOpen ? "cohort" : "waitlist";

      const { error } = await supabase.auth.updateUser({
        data: {
          onboarding_completed: true,
          application_type: applicationType,
          onboarding_data: data,
        },
      });
      if (error) {
        setSubmitError(error.message);
        return;
      }

      // Sync profile to Flask backend (creates a pending application)
      await fetch("/api/talent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          fullName: data.fullName,
          countryName: data.countryName,
          bio: data.bio,
          sectors: data.sectors,
          linkedinUrl: data.linkedinUrl,
          githubUrl: data.githubUrl,
          websiteUrl: data.websiteUrl,
          profilePhotoUrl: data.profilePhotoUrl,
          coverMediaUrl: data.coverMediaUrl,
          resumeUrl: data.resumeUrl,
          employmentType: data.employmentType,
        }),
      });

      router.push("/dashboard");
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm border border-white/20 bg-white/[0.08]">
              AT
            </div>
            <span className="text-white font-semibold">
              {platformConfig.shortName}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">Complete your profile</h1>
          <p className="text-white/40 mt-1 text-sm">
            {cohort.name} — {cohort.maxSize} spots available
          </p>
        </div>

        {/* Application status banner */}
        {cohort.isOpen ? (
          <div className="mb-6 rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-white px-3 py-1 rounded-full bg-white/10 border border-white/10 mb-2">
              Applications Open — {cohort.name}
            </span>
            <p className="text-white/50 text-sm">
              Complete your profile to apply. Accepted candidates will be
              notified within 5–7 business days.
            </p>
          </div>
        ) : (
          <div className="mb-6 rounded-xl bg-white/[0.04] border border-white/[0.08] p-4 text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-wider text-white/50 px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.06] mb-2">
              Applications Closed
            </span>
            <p className="text-white/50 text-sm">
              {cohort.name} is currently closed. Complete your profile to join the waitlist —
              you&apos;ll be first in line when the next cohort opens.
            </p>
          </div>
        )}

        {/* Profile detected banner */}
        {profileDetected && (
          <div className="mb-6 rounded-xl bg-white/[0.06] border border-white/[0.14] p-4 flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-sm">✓</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Your profile was found</p>
              <p className="text-white/50 text-xs mt-0.5">
                We already have your details on file. We&apos;ve pre-filled your form — review and update anything you&apos;d like to change.
              </p>
            </div>
          </div>
        )}

        <StepIndicator steps={STEPS} currentStep={step} />

        <div className="mt-8 rounded-2xl bg-white/[0.04] border border-white/[0.08] p-6 sm:p-8">
          {step === 0 && (
            <StepBasic
              data={data}
              onChange={updateData}
              onNext={handleNext}
              userId={userId}
            />
          )}
          {step === 1 && (
            <StepProfessional
              data={data}
              onChange={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 2 && (
            <StepMedia
              data={data}
              onChange={updateData}
              onNext={handleNext}
              onBack={handleBack}
              userId={userId}
            />
          )}
          {step === 3 && (
            <StepLinks
              data={data}
              onChange={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 4 && (
            <StepAvailability
              data={data}
              onChange={updateData}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}
          {step === 5 && (
            <StepCompensation
              data={data}
              onChange={updateData}
              onBack={handleBack}
              onSubmit={handleSubmit}
              submitting={submitting}
            />
          )}
        </div>

        {submitError && (
          <p className="text-center text-red-400 text-sm mt-4">{submitError}</p>
        )}

        <p className="text-center text-white/25 text-xs mt-6">
          Activation fee: ${platformConfig.cohort.activationFee} · Paid after approval · Active {platformConfig.cohort.periodDays} days
        </p>
      </div>
    </div>
  );
}
