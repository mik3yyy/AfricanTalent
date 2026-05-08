"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail } from "lucide-react";
import { platformConfig, COMPENSATION_RANGE } from "@platform/config";
import { PaystackButton } from "@/components/payment/paystack-button";

type OnboardingData = {
  fullName?: string;
  email?: string;
  countryCode?: string;
  countryName?: string;
  sectors?: string[];
  sector?: string;
  bio?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  employmentType?: string;
  compensationAccepted?: boolean;
  profilePhotoUrl?: string;
  coverMediaUrl?: string;
  coverMediaType?: string;
  resumeUrl?: string;
};

type UserMeta = {
  onboarding_completed?: boolean;
  application_type?: "cohort" | "waitlist";
  application_status?: "pending_review" | "approved" | "active" | "expired" | "rejected";
  payment_reference?: string;
  active_since?: string;
  expires_at?: string;
  onboarding_data?: OnboardingData;
  full_name?: string;
  avatar_url?: string;
};

const SECTOR_LABELS: Record<string, string> = {
  software_engineering: "Software Engineering",
  mobile_development: "Mobile Development",
  web_development: "Web Development",
  vibe_coding: "Vibe Coding",
  product_management: "Product Management",
  design_ux: "Design / UX",
  data_analytics: "Data & Analytics",
  ai_ml: "AI / Machine Learning",
  devops_infrastructure: "DevOps / Infrastructure",
  cybersecurity: "Cybersecurity",
  marketing: "Marketing",
  sales: "Sales",
  finance: "Finance",
  operations: "Operations",
  other: "Other",
};

function formatSectors(od: OnboardingData): string {
  const sectors = od.sectors ?? (od.sector ? [od.sector] : []);
  if (sectors.length === 0) return "—";
  return sectors.map((s) => SECTOR_LABELS[s] ?? s).join(", ");
}

function formatEmploymentType(val?: string) {
  if (!val) return "—";
  if (val === "full_time") return "Full-time";
  if (val === "contract") return "Contract";
  if (val === "both") return "Open to both";
  return val;
}

function daysRemaining(expiresAt?: string): number | null {
  if (!expiresAt) return null;
  const diff = new Date(expiresAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [meta, setMeta] = useState<UserMeta>({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? "");
        setUserId(user.id);
        setMeta((user.user_metadata as UserMeta) ?? {});
      }
      setLoading(false);
    });
  }, []);

  async function handlePaymentSuccess(reference: string) {
    setPaymentLoading(true);
    setPaymentError(null);
    try {
      const res = await fetch("/api/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const data = await res.json() as { success?: boolean; error?: string; expiresAt?: string };
      if (!res.ok || !data.success) {
        setPaymentError(data.error ?? "Payment verification failed. Contact support.");
        return;
      }
      setPaymentSuccess(true);
      // Refresh metadata
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setMeta(user.user_metadata as UserMeta);
    } catch {
      setPaymentError("Failed to verify payment. Contact support@afritalent.com");
    } finally {
      setPaymentLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-white/[0.06] rounded-lg" />
          <div className="h-32 bg-white/[0.04] rounded-2xl" />
          <div className="h-48 bg-white/[0.04] rounded-2xl" />
        </div>
      </div>
    );
  }

  const od = meta.onboarding_data ?? {};
  const firstName = (od.fullName ?? meta.full_name ?? "").split(" ")[0] || "there";
  const appStatus = meta.application_status;
  const daysLeft = daysRemaining(meta.expires_at);

  // Derive display status
  const isWaitlist = !appStatus || appStatus === "pending_review" ||
    (meta.application_type === "waitlist" && !appStatus);
  const isApproved = appStatus === "approved";
  const isActive = appStatus === "active";
  const isExpired = appStatus === "expired";
  const isRejected = appStatus === "rejected";

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Welcome back, {firstName}</h1>
        <p className="text-white/40 mt-1 text-sm">Here&apos;s your application dashboard.</p>
      </div>

      {/* Application Status */}
      <div className="glass-card rounded-2xl p-6">
        <p className="text-xs uppercase tracking-wider text-white/30 mb-4">Application Status</p>

        {isActive && (
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-1.5 rounded-full bg-white shrink-0" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-semibold text-lg">Active listing</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/10">Active</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Your profile is live and visible to companies.
                {daysLeft !== null && (
                  <> Listing expires in <span className="text-white font-medium">{daysLeft} day{daysLeft !== 1 ? "s" : ""}</span>. After that, you&apos;ll need to reapply for the next cohort.</>
                )}
              </p>
            </div>
          </div>
        )}

        {isApproved && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 mt-1.5 rounded-full bg-white/80 shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-semibold text-lg">You&apos;re approved!</p>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/10">Approved</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">
                  Pay the ${platformConfig.cohort.activationFee} activation fee to go live. Your listing will be active for{" "}
                  <span className="text-white">{platformConfig.cohort.periodDays} days</span> (3 months), after which you&apos;ll need to reapply.
                </p>
              </div>
            </div>

            {paymentSuccess ? (
              <div className="p-4 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium">
                ✓ Payment received — your profile is now live!
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <PaystackButton
                  email={email}
                  amountUsd={platformConfig.cohort.activationFee}
                  userId={userId}
                  onSuccess={handlePaymentSuccess}
                  loading={paymentLoading}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 disabled:opacity-50 transition-colors w-full sm:w-auto"
                >
                  {paymentLoading ? "Verifying…" : `Pay $${platformConfig.cohort.activationFee} to Activate`}
                </PaystackButton>
                {paymentError && <p className="text-xs text-red-400">{paymentError}</p>}
                <p className="text-xs text-white/30">Secure payment via Paystack · Card, bank transfer &amp; mobile money accepted</p>
              </div>
            )}
          </div>
        )}

        {isExpired && (
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-1.5 rounded-full bg-white/30 shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-semibold text-lg">Listing expired</p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 border border-white/[0.06]">Expired</span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                Your 3-month listing period has ended. Update your profile and reapply for the next cohort.
              </p>
            </div>
          </div>
        )}

        {isRejected && (
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-1.5 rounded-full bg-white/20 shrink-0" />
            <div>
              <p className="text-white font-semibold text-lg">Application not accepted</p>
              <p className="text-white/50 text-sm mt-1">
                Your application wasn&apos;t accepted for this cohort. You may reapply for the next one.
                Contact <a href="mailto:support@afritalent.com" className="underline hover:text-white/70">support@afritalent.com</a> for feedback.
              </p>
            </div>
          </div>
        )}

        {isWaitlist && (
          <div className="flex items-start gap-4">
            <div className="w-2 h-2 mt-1.5 rounded-full bg-white/40 shrink-0" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-white font-semibold text-lg">
                  {meta.application_type === "waitlist" ? "On the waitlist" : "Under review"}
                </p>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60 border border-white/10">
                  {meta.application_type === "waitlist" ? "Waitlist" : "Under Review"}
                </span>
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                {meta.application_type === "waitlist"
                  ? `We'll notify you at ${email} when the next cohort opens.`
                  : "Our team is reviewing your profile. We'll email you within 5–7 business days."}
              </p>
              <p className="text-white/30 text-xs mt-2">
                If approved, you&apos;ll pay a one-time ${platformConfig.cohort.activationFee} fee to go live for 3 months.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Profile Summary */}
      <div className="glass-card rounded-2xl p-6">
        <p className="text-xs uppercase tracking-wider text-white/30 mb-4">Profile Summary</p>

        {(od.profilePhotoUrl || od.coverMediaUrl) && (
          <div className="flex gap-4 mb-5">
            {od.profilePhotoUrl && (
              <div>
                <p className="text-xs text-white/30 mb-1">Portrait</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={od.profilePhotoUrl} alt="Portrait" className="w-16 h-20 object-cover rounded-lg border border-white/10" />
              </div>
            )}
            {od.coverMediaUrl && (
              <div>
                <p className="text-xs text-white/30 mb-1">Cover</p>
                {od.coverMediaType === "video" ? (
                  <video src={od.coverMediaUrl} className="w-36 h-20 object-cover rounded-lg border border-white/10" muted />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={od.coverMediaUrl} alt="Cover" className="w-36 h-20 object-cover rounded-lg border border-white/10" />
                )}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
          {[
            { label: "Full Name", value: od.fullName },
            { label: "Email", value: email },
            { label: "Country", value: od.countryName },
            { label: "Sector(s)", value: formatSectors(od) },
            { label: "Employment Type", value: formatEmploymentType(od.employmentType) },
            { label: "Compensation Range", value: od.compensationAccepted ? `$${COMPENSATION_RANGE.min.toLocaleString()}–$${COMPENSATION_RANGE.max.toLocaleString()}/mo` : "—" },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-xs text-white/30 mb-0.5">{label}</p>
              <p className="text-sm text-white/80 font-medium">{value || "—"}</p>
            </div>
          ))}
        </div>

        {od.resumeUrl && (
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <a href={od.resumeUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              View Resume
            </a>
          </div>
        )}

        {(od.linkedinUrl || od.githubUrl || od.websiteUrl) && (
          <div className="mt-5 pt-4 border-t border-white/[0.06]">
            <p className="text-xs text-white/30 mb-2">Links</p>
            <div className="flex flex-wrap gap-2">
              {od.linkedinUrl && <a href={od.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/10 transition-colors">LinkedIn</a>}
              {od.githubUrl && <a href={od.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/10 transition-colors">GitHub</a>}
              {od.websiteUrl && <a href={od.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/10 transition-colors">Website</a>}
            </div>
          </div>
        )}

        <p className="text-xs text-white/25 mt-5 pt-4 border-t border-white/[0.06]">
          Need to update your profile?{" "}
          <a href="/profile/edit" className="underline hover:text-white/50">Edit here</a>
        </p>
      </div>

      {/* Contact Requests */}
      <div className="glass-card rounded-2xl p-6">
        <p className="text-xs uppercase tracking-wider text-white/30 mb-4">Contact Requests</p>
        <div className="py-8 text-center">
          <Mail className="w-7 h-7 mx-auto mb-3 text-white/20" />
          <p className="text-white/40 text-sm">No contact requests yet.</p>
          <p className="text-white/25 text-xs mt-1 max-w-xs mx-auto">
            Once your profile is approved and active, companies can reach out here.
          </p>
        </div>
      </div>
    </div>
  );
}
