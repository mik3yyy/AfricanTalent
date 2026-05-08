"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Github, Linkedin, Globe, Pencil, FileText, Briefcase, MapPin } from "lucide-react";
import { COMPENSATION_RANGE } from "@platform/config";

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

function formatEmploymentType(val?: string): string {
  if (!val) return "—";
  if (val === "full_time") return "Full-time";
  if (val === "contract") return "Contract";
  if (val === "both") return "Open to both";
  return val;
}

function getInitials(name?: string): string {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>("");
  const [meta, setMeta] = useState<UserMeta>({});

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email ?? "");
        setMeta((user.user_metadata as UserMeta) ?? {});
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4 animate-pulse p-6">
        <div className="h-48 bg-white/[0.04] rounded-2xl" />
        <div className="h-64 bg-white/[0.04] rounded-2xl" />
      </div>
    );
  }

  const od = meta.onboarding_data ?? {};
  const initials = getInitials(od.fullName ?? meta.full_name);
  const sectors = od.sectors ?? (od.sector ? [od.sector] : []);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Cover media */}
      <div className="relative w-full aspect-video bg-white/[0.04] rounded-2xl overflow-hidden">
        {od.coverMediaUrl && od.coverMediaType === "video" ? (
          <video
            src={od.coverMediaUrl}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : od.coverMediaUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={od.coverMediaUrl} alt="Cover" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center">
            <p className="text-white/20 text-sm">No cover media</p>
          </div>
        )}

        {/* Smooth gradient fade — eased curve so no visible hard line */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, transparent 20%, rgba(5,5,5,0.04) 35%, rgba(5,5,5,0.18) 50%, rgba(5,5,5,0.46) 63%, rgba(5,5,5,0.72) 75%, rgba(5,5,5,0.90) 86%, rgba(5,5,5,0.98) 94%, #050505 100%)",
          }}
        />

        {/* Edit button */}
        <button
          onClick={() => router.push("/profile/edit")}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm border border-white/20 text-white text-xs font-medium hover:bg-black/80 transition-colors"
        >
          <Pencil className="w-3 h-3" />
          Edit Profile
        </button>
      </div>

      {/* Profile header — no card border, seamlessly continues the dark fade */}
      <div className="relative z-10 px-6 pb-6 -mt-14">
        <div className="flex items-end gap-4 mb-5">
          {/* Portrait photo */}
          <div className="flex-shrink-0 w-24 h-32 rounded-xl overflow-hidden border-2 border-black bg-white/[0.06] shadow-xl">
            {od.profilePhotoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={od.profilePhotoUrl} alt={od.fullName ?? "Portrait"} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/30 text-2xl font-bold">
                {initials}
              </div>
            )}
          </div>

          {/* Resume button */}
          {od.resumeUrl && (
            <a
              href={od.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              <FileText className="w-4 h-4" />
              Resume
            </a>
          )}
        </div>

        {/* Name + sectors */}
        <h1 className="text-2xl font-bold text-white leading-tight">
          {od.fullName || meta.full_name || "—"}
        </h1>

        {sectors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {sectors.map((s) => (
              <span
                key={s}
                className="px-2.5 py-0.5 rounded-md bg-white/10 border border-white/10 text-white/70 text-xs font-medium"
              >
                {SECTOR_LABELS[s] ?? s}
              </span>
            ))}
          </div>
        )}

        {/* Location + employment */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/40">
          {od.countryName && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {od.countryName}
            </span>
          )}
          {od.employmentType && (
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              {formatEmploymentType(od.employmentType)}
            </span>
          )}
          {od.compensationAccepted && (
            <span className="text-white/40">
              ${COMPENSATION_RANGE.min.toLocaleString()}–${COMPENSATION_RANGE.max.toLocaleString()}/mo
            </span>
          )}
        </div>

        {/* Social links */}
        <div className="flex flex-wrap gap-2 mt-4">
          {od.linkedinUrl && (
            <a href={od.linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <Linkedin className="w-3.5 h-3.5" /> LinkedIn
            </a>
          )}
          {od.githubUrl && (
            <a href={od.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <Github className="w-3.5 h-3.5" /> GitHub
            </a>
          )}
          {od.websiteUrl && (
            <a href={od.websiteUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/[0.06] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/10 transition-colors">
              <Globe className="w-3.5 h-3.5" /> Website
            </a>
          )}
        </div>
      </div>

      {/* Bio */}
      {od.bio && (
        <div className="glass-card rounded-2xl p-6 mt-4">
          <p className="text-xs uppercase tracking-wider text-white/30 mb-3">About</p>
          <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{od.bio}</p>
        </div>
      )}
    </div>
  );
}
