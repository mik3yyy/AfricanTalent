"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAllTalent, getTalentById } from "@/lib/talent-db";
import type { TalentProfile } from "@/lib/mock-data";
import { ContactModal } from "@/components/talent/contact-modal";
import { SaveModal } from "@/components/talent/save-modal";
import { TalentImage } from "@/components/ui/talent-image";
import { ArrowLeft, Bookmark, BookmarkCheck, Github, Linkedin, Globe, Twitter, ExternalLink, MapPin, Briefcase } from "lucide-react";

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
};

function formatEmployment(types: string[]): string {
  return types.join(" · ");
}

function ProfileSkeleton() {
  return (
    <div className="min-h-screen animate-pulse" style={{ backgroundColor: "#050505" }}>
      <div className="w-full" style={{ height: "55vh", backgroundColor: "rgba(255,255,255,0.05)" }} />
      <div className="max-w-3xl mx-auto px-4 sm:px-8 -mt-32 relative z-10 space-y-4 pt-4">
        <div className="flex items-end gap-5 mb-6">
          <div className="w-28 h-36 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
          <div className="flex-1 space-y-3 pb-2">
            <div className="h-8 w-48 rounded" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
            <div className="h-4 w-64 rounded" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
          </div>
        </div>
        <div className="h-24 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />
        <div className="h-32 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />
      </div>
    </div>
  );
}

export default function TalentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [talent, setTalent] = useState<TalentProfile | null>(null);
  const [relatedTalent, setRelatedTalent] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [showSave, setShowSave] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([getTalentById(id as string), getAllTalent()])
      .then(([profile, all]) => {
        setTalent(profile);
        if (profile) {
          setRelatedTalent(
            all.filter((t) => t.id !== profile.id && t.sectors.some((s) => profile.sectors.includes(s))).slice(0, 10)
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <ProfileSkeleton />;

  if (!talent) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#050505" }}>
        <div className="text-center">
          <p className="text-white/40 mb-4">Profile not found</p>
          <button onClick={() => router.push("/search")} className="text-sm text-white/60 hover:text-white">
            ← Back to browse
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#050505" }}>
      {/* Cover hero */}
      <div className="relative w-full" style={{ height: "55vh", minHeight: 320 }}>
        <div className="absolute inset-0 overflow-hidden">
          <TalentImage
            src={talent.coverMediaUrl ?? talent.profilePhotoUrl}
            alt={talent.name}
            className="w-full h-full object-cover"
            style={talent.coverMediaUrl ? {} : { filter: "blur(3px) scale(1.05)" }}
            priority
          />
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.50) 40%, rgba(5,5,5,0.20) 100%)" }} />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(5,5,5,0.60) 0%, transparent 60%)" }} />
        <div className="absolute inset-x-0 top-0 h-20" style={{ background: "linear-gradient(to bottom, rgba(5,5,5,0.80), transparent)" }} />

        <button
          onClick={() => router.back()}
          className="absolute top-16 left-4 sm:left-8 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
          style={{ backgroundColor: "rgba(0,0,0,0.50)", color: "rgba(255,255,255,0.70)", backdropFilter: "blur(8px)" }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
      </div>

      {/* Profile section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8 -mt-32 relative z-10">
        <div className="flex items-end gap-5 mb-6">
          {/* Portrait */}
          <div
            className="w-28 h-36 rounded-xl overflow-hidden border-2 shadow-2xl flex-shrink-0"
            style={{ borderColor: "rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <TalentImage src={talent.profilePhotoUrl} alt={talent.name} className="w-full h-full object-cover" priority />
          </div>

          {/* Name + actions */}
          <div className="flex-1 min-w-0 pb-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{talent.name}</h1>
            <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{talent.headline}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowContact(true)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-black bg-white hover:bg-white/90 transition-all"
              >
                Contact
              </button>
              <button
                onClick={() => { setSaved((s) => !s); if (!saved) setShowSave(true); }}
                className="px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
                style={{
                  backgroundColor: saved ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
                  color: saved ? "#ffffff" : "rgba(255,255,255,0.60)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                {saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                {saved ? "Saved" : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex flex-wrap gap-4 mb-6 text-sm" style={{ color: "rgba(255,255,255,0.50)" }}>
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> {talent.location}</span>
          <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5" /> {talent.yearsOfExperience} years exp</span>
          <span style={{ color: "rgba(255,255,255,0.40)" }}>
            ${talent.compensationMin.toLocaleString()}–${talent.compensationMax.toLocaleString()}/mo
          </span>
        </div>

        {/* Sectors */}
        <div className="flex flex-wrap gap-2 mb-6">
          {talent.sectors.map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-md text-xs font-medium"
              style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.70)" }}
            >
              {SECTOR_LABELS[s] ?? s}
            </span>
          ))}
          <span
            className="px-2.5 py-1 rounded-md text-xs"
            style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.40)" }}
          >
            {formatEmployment(talent.employmentType)}
          </span>
        </div>

        {/* Bio */}
        <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>About</p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>{talent.bio}</p>
        </div>

        {/* Skills */}
        <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>Skills</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {talent.primarySkills.map((s) => (
              <span key={s} className="px-2.5 py-1 rounded-md text-xs font-medium bg-white text-black">{s}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {talent.secondarySkills.map((s) => (
              <span
                key={s}
                className="px-2.5 py-1 rounded-md text-xs"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)" }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        {Object.values(talent.portfolioLinks).some(Boolean) && (
          <div className="rounded-xl p-5 mb-4" style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>Links</p>
            <div className="flex flex-wrap gap-3">
              {talent.portfolioLinks.github && (
                <a href={talent.portfolioLinks.github} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.70)" }}>
                  <Github className="w-4 h-4" /> GitHub <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
              {talent.portfolioLinks.linkedin && (
                <a href={talent.portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.70)" }}>
                  <Linkedin className="w-4 h-4" /> LinkedIn <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
              {talent.portfolioLinks.portfolio && (
                <a href={talent.portfolioLinks.portfolio} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.70)" }}>
                  <Globe className="w-4 h-4" /> Portfolio <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
              {talent.portfolioLinks.twitter && (
                <a href={talent.portfolioLinks.twitter} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.70)" }}>
                  <Twitter className="w-4 h-4" /> Twitter <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* More like this */}
        {relatedTalent.length > 0 && (
          <div className="mb-16">
            <h3 className="text-white font-semibold text-lg mb-4">More like this</h3>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-4 sm:-mx-8 px-4 sm:px-8">
              {relatedTalent.map((t) => (
                <a key={t.id} href={`/talent/${t.id}`} className="w-36 flex-shrink-0">
                  <div
                    className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                  >
                    <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105 group-hover:brightness-110">
                      <TalentImage src={t.profilePhotoUrl} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div
                      className="absolute inset-x-0 bottom-0 p-2.5"
                      style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)" }}
                    >
                      <p className="text-white font-semibold text-xs leading-tight truncate">{t.name}</p>
                      <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.55)" }}>{t.headline}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <ContactModal open={showContact} onClose={() => setShowContact(false)} talentName={talent.name} talentHeadline={talent.headline} />
      <SaveModal open={showSave} onClose={() => setShowSave(false)} talentName={talent.name} />
    </div>
  );
}
