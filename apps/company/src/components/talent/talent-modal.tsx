"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, X, Github, Linkedin, Globe, Twitter, ExternalLink, MapPin, Briefcase } from "lucide-react";
import type { TalentProfile } from "@/lib/mock-data";
import { TalentCard } from "@/components/search/talent-card";
import { TalentImage } from "@/components/ui/talent-image";

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

interface TalentModalProps {
  talent: TalentProfile;
  allTalents: TalentProfile[];
  onClose: () => void;
  onContactRequest: (talent: TalentProfile) => void;
}

export function TalentModal({ talent: initialTalent, allTalents, onClose, onContactRequest }: TalentModalProps) {
  const [history, setHistory] = useState<TalentProfile[]>([initialTalent]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const talent = history[history.length - 1];

  const moreLikeThis = allTalents
    .filter((t) => t.id !== talent.id && t.sectors.some((s) => talent.sectors.includes(s)))
    .slice(0, 12);

  const openRelated = (t: TalentProfile) => {
    setHistory((h) => [...h, t]);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory((h) => h.slice(0, -1));
      scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        ref={scrollRef}
        className="relative w-full sm:max-w-2xl sm:mx-4 sm:rounded-2xl overflow-y-auto"
        style={{
          backgroundColor: "#141414",
          maxHeight: "92vh",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover hero */}
        <div className="relative w-full" style={{ height: 280 }}>
          <div className="absolute inset-0 overflow-hidden sm:rounded-t-2xl">
            <TalentImage
              src={talent.coverMediaUrl ?? talent.profilePhotoUrl}
              alt={talent.name}
              className="w-full h-full object-cover"
              style={talent.coverMediaUrl ? {} : { filter: "blur(2px) scale(1.08)" }}
              priority
            />
          </div>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, #141414 0%, rgba(20,20,20,0.55) 45%, transparent 100%)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(20,20,20,0.65) 0%, transparent 60%)" }}
          />

          {/* Top controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.80)", backdropFilter: "blur(8px)" }}
            >
              <ArrowLeft className="w-4 h-4" />
              {history.length > 1 ? "Back" : "Close"}
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ backgroundColor: "rgba(0,0,0,0.55)", color: "rgba(255,255,255,0.70)", backdropFilter: "blur(8px)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Profile content */}
        <div className="px-6 -mt-20 relative z-10 pb-8">
          {/* Portrait + actions */}
          <div className="flex items-end gap-4 mb-5">
            <div
              className="w-24 h-32 rounded-xl overflow-hidden border-2 shadow-2xl flex-shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <TalentImage src={talent.profilePhotoUrl} alt={talent.name} className="w-full h-full object-cover" priority />
            </div>
            <div className="pb-1">
              <button
                onClick={() => onContactRequest(talent)}
                className="px-5 py-2.5 rounded-lg text-sm font-semibold text-black bg-white hover:bg-white/90 transition-all"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Name + headline */}
          <h2 className="text-2xl font-extrabold text-white leading-tight">{talent.name}</h2>
          <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>{talent.headline}</p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-4 mt-4 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> {talent.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" /> {talent.yearsOfExperience} yrs exp
            </span>
            <span style={{ color: "rgba(255,255,255,0.35)" }}>
              ${talent.compensationMin.toLocaleString()}–${talent.compensationMax.toLocaleString()}/mo
            </span>
          </div>

          {/* Sectors + employment */}
          <div className="flex flex-wrap gap-2 mt-4">
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
              style={{ backgroundColor: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.38)" }}
            >
              {talent.employmentType.join(" · ")}
            </span>
          </div>

          {/* Bio */}
          <div
            className="rounded-xl p-4 mt-5"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-xs uppercase tracking-wider mb-2" style={{ color: "rgba(255,255,255,0.30)" }}>About</p>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.70)" }}>{talent.bio}</p>
          </div>

          {/* Skills */}
          <div
            className="rounded-xl p-4 mt-3"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>Skills</p>
            <div className="flex flex-wrap gap-2 mb-2">
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
            <div
              className="rounded-xl p-4 mt-3"
              style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <p className="text-xs uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>Links</p>
              <div className="flex flex-wrap gap-2">
                {talent.portfolioLinks.github && (
                  <a href={talent.portfolioLinks.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.70)" }}>
                    <Github className="w-3.5 h-3.5" /> GitHub <ExternalLink className="w-3 h-3 opacity-40" />
                  </a>
                )}
                {talent.portfolioLinks.linkedin && (
                  <a href={talent.portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.70)" }}>
                    <Linkedin className="w-3.5 h-3.5" /> LinkedIn <ExternalLink className="w-3 h-3 opacity-40" />
                  </a>
                )}
                {talent.portfolioLinks.portfolio && (
                  <a href={talent.portfolioLinks.portfolio} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.70)" }}>
                    <Globe className="w-3.5 h-3.5" /> Portfolio <ExternalLink className="w-3 h-3 opacity-40" />
                  </a>
                )}
                {talent.portfolioLinks.twitter && (
                  <a href={talent.portfolioLinks.twitter} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)", color: "rgba(255,255,255,0.70)" }}>
                    <Twitter className="w-3.5 h-3.5" /> Twitter <ExternalLink className="w-3 h-3 opacity-40" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* More like this */}
          {moreLikeThis.length > 0 && (
            <div className="mt-8">
              <h3 className="text-white font-semibold text-base mb-4">More like this</h3>
              <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-6 px-6">
                {moreLikeThis.map((t) => (
                  <TalentCard key={t.id} talent={t} size="md" onClick={() => openRelated(t)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
