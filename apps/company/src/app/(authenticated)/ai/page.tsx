"use client";

import { useState } from "react";
import type { TalentProfile } from "@/lib/mock-data";
import { TalentModal } from "@/components/talent/talent-modal";
import { ContactModal } from "@/components/talent/contact-modal";
import { TalentImage } from "@/components/ui/talent-image";
import { getAllTalent } from "@/lib/talent-db";
import { Sparkles, ArrowRight, Loader2, MapPin, Briefcase } from "lucide-react";
import { useEffect } from "react";

interface MatchResult {
  talent: TalentProfile;
  reason: string;
}

const SECTOR_LABELS: Record<string, string> = {
  software_engineering: "Software Eng",
  mobile_development: "Mobile Dev",
  web_development: "Web Dev",
  vibe_coding: "Vibe Coder",
  product_management: "Product",
  design_ux: "Design / UX",
  data_analytics: "Data",
  ai_ml: "AI / ML",
  devops_infrastructure: "DevOps",
  cybersecurity: "Cybersecurity",
  marketing: "Marketing",
};

const EXAMPLE_JDS = [
  "We need a mobile developer who can build our iOS app from scratch. Must know Swift and have 3+ years experience with mobile apps.",
  "Looking for a product manager to lead our fintech product. Should have experience with payments, APIs, and cross-functional team leadership.",
  "Need a UI/UX designer for a 3-month contract. Figma expert, portfolio of mobile app designs required.",
];

function MatchCard({ talent, reason, rank, onOpen }: { talent: TalentProfile; reason: string; rank: number; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="w-full text-left group transition-all duration-200"
      style={{ outline: "none" }}
    >
      <div
        className="rounded-2xl overflow-hidden transition-all duration-200 group-hover:scale-[1.01]"
        style={{
          backgroundColor: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Cover strip */}
        <div className="relative w-full" style={{ height: 120 }}>
          <TalentImage
            src={talent.coverMediaUrl ?? talent.profilePhotoUrl}
            alt={talent.name}
            className="w-full h-full object-cover"
            style={talent.coverMediaUrl ? {} : { filter: "blur(3px) scale(1.08)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(20,20,20,1) 0%, rgba(20,20,20,0.5) 50%, rgba(20,20,20,0.15) 100%)" }}
          />
          {/* Rank badge */}
          <div
            className="absolute top-3 left-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: rank === 1 ? "rgba(255,255,255,0.92)" : "rgba(0,0,0,0.60)",
              color: rank === 1 ? "#050505" : "rgba(255,255,255,0.75)",
              backdropFilter: "blur(4px)",
            }}
          >
            {rank}
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-4 -mt-10 relative">
          {/* Portrait overlapping the cover */}
          <div
            className="w-16 h-20 rounded-xl overflow-hidden border-2 mb-3 shadow-xl"
            style={{ borderColor: "rgba(255,255,255,0.15)", backgroundColor: "rgba(255,255,255,0.06)" }}
          >
            <TalentImage src={talent.profilePhotoUrl} alt={talent.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-base leading-tight truncate">{talent.name}</p>
              <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.50)" }}>{talent.headline}</p>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
                <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                  <MapPin className="w-3 h-3" />{talent.location}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "rgba(255,255,255,0.40)" }}>
                  <Briefcase className="w-3 h-3" />{talent.yearsOfExperience} yrs
                </span>
              </div>

              {/* Sectors */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {talent.sectors.slice(0, 2).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded text-xs"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)" }}
                  >
                    {SECTOR_LABELS[s] ?? s}
                  </span>
                ))}
              </div>
            </div>

            <ArrowRight
              className="w-4 h-4 mt-1 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              style={{ color: "rgba(255,255,255,0.30)" }}
            />
          </div>

          {/* Primary skills */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {talent.primarySkills.slice(0, 4).map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-md text-xs font-medium bg-white text-black">{s}</span>
            ))}
          </div>

          {/* AI match reason */}
          <div
            className="mt-3 rounded-xl px-3 py-2.5"
            style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3" style={{ color: "rgba(255,255,255,0.35)" }} />
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Why they match</span>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.60)" }}>{reason}</p>
          </div>
        </div>
      </div>
    </button>
  );
}

export default function AIPage() {
  const [allTalent, setAllTalent] = useState<TalentProfile[]>([]);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  const [contactTalent, setContactTalent] = useState<TalentProfile | null>(null);

  useEffect(() => {
    getAllTalent().then(setAllTalent).catch(console.error);
  }, []);

  const handleMatch = async () => {
    if (!jd.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/ai-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jd }),
      });
      const data = await res.json() as { results?: MatchResult[]; error?: string };
      if (!res.ok || data.error) throw new Error(data.error ?? "Something went wrong");
      setResults(data.results ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to find matches");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-8" style={{ backgroundColor: "#050505" }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-white/60" />
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.40)" }}>
              AI Matching
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-white leading-tight">Find the right talent</h1>
          <p className="mt-2 text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
            Paste your job description and AI will shortlist the best-matching candidates from our directory.
          </p>
        </div>

        {/* JD input */}
        <div
          className="rounded-2xl p-4"
          style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <textarea
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste your job description here… include the role, required skills, experience level, and any other details."
            rows={8}
            className="w-full bg-transparent text-sm text-white placeholder-white/25 outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)" }}>
              {jd.length} chars
            </span>
            <button
              onClick={handleMatch}
              disabled={!jd.trim() || loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-40"
              style={{ backgroundColor: "#ffffff", color: "#050505" }}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Matching…</>
              ) : (
                <>Find Talents<ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>

        {/* Examples */}
        {!results && !loading && (
          <div className="mt-6">
            <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.30)" }}>Try an example:</p>
            <div className="flex flex-col gap-2">
              {EXAMPLE_JDS.map((ex, i) => (
                <button
                  key={i}
                  onClick={() => setJd(ex)}
                  className="text-left px-4 py-3 rounded-xl text-xs transition-all"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.50)",
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div
            className="mt-6 px-4 py-3 rounded-xl text-sm"
            style={{ backgroundColor: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.15)", color: "rgba(255,130,130,0.90)" }}
          >
            {error}
          </div>
        )}

        {/* Loading shimmer */}
        {loading && (
          <div className="mt-8 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden animate-pulse"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
              >
                <div style={{ height: 120, backgroundColor: "rgba(255,255,255,0.06)" }} />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-40 rounded" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
                  <div className="h-3 w-56 rounded" style={{ backgroundColor: "rgba(255,255,255,0.05)" }} />
                  <div className="h-12 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.04)" }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">
                {results.length > 0 ? `${results.length} match${results.length !== 1 ? "es" : ""} found` : "No matches found"}
              </h2>
              {results.length > 0 && (
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>ranked by relevance</span>
              )}
            </div>

            {results.length === 0 ? (
              <p className="text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
                Try a more specific description or different skills.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {results.map(({ talent, reason }, idx) => (
                  <MatchCard
                    key={talent.id}
                    talent={talent}
                    reason={reason}
                    rank={idx + 1}
                    onOpen={() => setSelectedTalent(talent)}
                  />
                ))}
              </div>
            )}

            <button
              onClick={() => { setResults(null); setJd(""); }}
              className="mt-6 text-sm transition-colors"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              ← New search
            </button>
          </div>
        )}
      </div>

      {selectedTalent && (
        <TalentModal
          talent={selectedTalent}
          allTalents={allTalent}
          onClose={() => setSelectedTalent(null)}
          onContactRequest={(t) => setContactTalent(t)}
        />
      )}

      {contactTalent && (
        <ContactModal
          open={true}
          onClose={() => setContactTalent(null)}
          talentName={contactTalent.name}
          talentHeadline={contactTalent.headline}
        />
      )}
    </div>
  );
}
