"use client";

import { useState, useMemo, useEffect } from "react";
import type { TalentProfile } from "@/lib/mock-data";
import { getAllTalent } from "@/lib/talent-db";
import { TalentCard } from "@/components/search/talent-card";
import { TalentModal } from "@/components/talent/talent-modal";
import { ContactModal } from "@/components/talent/contact-modal";
import { Search, X } from "lucide-react";
import { TalentImage } from "@/components/ui/talent-image";

const SECTOR_ROWS = [
  { label: "Top Talents",        filter: (t: TalentProfile) => t.featured },
  { label: "Mobile Developers",  filter: (t: TalentProfile) => t.sectors.includes("mobile_development") },
  { label: "Web Developers",     filter: (t: TalentProfile) => t.sectors.includes("web_development") },
  { label: "AI & Machine Learning", filter: (t: TalentProfile) => t.sectors.includes("ai_ml") },
  { label: "Vibe Coders",        filter: (t: TalentProfile) => t.sectors.includes("vibe_coding") },
  { label: "DevOps Engineers",   filter: (t: TalentProfile) => t.sectors.includes("devops_infrastructure") },
  { label: "Product Managers",   filter: (t: TalentProfile) => t.sectors.includes("product_management") },
  { label: "Designers & UX",     filter: (t: TalentProfile) => t.sectors.includes("design_ux") },
  { label: "Data Scientists",    filter: (t: TalentProfile) => t.sectors.includes("data_analytics") },
];

function SkeletonRow() {
  return (
    <section className="mb-8">
      <div className="h-6 w-40 rounded-md mb-3 mx-4 sm:mx-8 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
      <div className="flex gap-3 px-4 sm:px-8 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-36 flex-shrink-0 aspect-[3/4] rounded-xl animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
        ))}
      </div>
    </section>
  );
}

function TalentRow({ label, talents, onSelect }: { label: string; talents: TalentProfile[]; onSelect: (t: TalentProfile) => void }) {
  if (talents.length === 0) return null;
  return (
    <section className="mb-8">
      <h2 className="text-white font-semibold text-lg mb-3 px-4 sm:px-8">{label}</h2>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-8 pb-2">
        {talents.map((t) => (
          <TalentCard key={t.id} talent={t} size="md" onClick={() => onSelect(t)} />
        ))}
      </div>
    </section>
  );
}

export default function BrowsePage() {
  const [allTalent, setAllTalent] = useState<TalentProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [selectedTalent, setSelectedTalent] = useState<TalentProfile | null>(null);
  const [contactTalent, setContactTalent] = useState<TalentProfile | null>(null);

  useEffect(() => {
    getAllTalent()
      .then(setAllTalent)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hero = allTalent.find((t) => t.featured) ?? allTalent[0];

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allTalent.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.headline.toLowerCase().includes(q) ||
        t.sectors.some((s) => s.toLowerCase().includes(q)) ||
        t.primarySkills.some((s) => s.toLowerCase().includes(q)) ||
        t.country.toLowerCase().includes(q)
    );
  }, [query, allTalent]);

  return (
    <div style={{ backgroundColor: "#050505" }}>
      {/* Hero */}
      {!searching && (
        <div className="relative w-full" style={{ height: "70vh", minHeight: 400 }}>
          {hero ? (
            <>
              <div className="absolute inset-0 overflow-hidden">
                <TalentImage
                  src={hero.coverMediaUrl ?? hero.profilePhotoUrl}
                  alt={hero.name}
                  className="w-full h-full object-cover"
                  style={hero.coverMediaUrl ? {} : { filter: "blur(2px) scale(1.05)" }}
                  priority
                />
              </div>
              <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(5,5,5,0.88) 0%, rgba(5,5,5,0.45) 55%, transparent 100%)" }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.55) 28%, transparent 65%)" }} />
              <div className="absolute inset-x-0 top-0 h-32" style={{ background: "linear-gradient(to bottom, rgba(5,5,5,0.70) 0%, transparent 100%)" }} />
              <div className="absolute bottom-16 left-0 px-4 sm:px-8 max-w-lg">
                <p className="text-xs font-bold tracking-widest mb-2 uppercase" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Featured Talent
                </p>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">{hero.name}</h1>
                <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.60)" }}>{hero.headline}</p>
                <p className="text-sm leading-relaxed mb-6 line-clamp-3" style={{ color: "rgba(255,255,255,0.50)" }}>{hero.bio}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setSelectedTalent(hero)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all"
                    style={{ backgroundColor: "#ffffff", color: "#050505" }}
                  >
                    View Profile
                  </button>
                  <span className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff" }}>
                    {hero.country}
                  </span>
                </div>
              </div>
            </>
          ) : (
            // Hero skeleton
            <div className="absolute inset-0 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
              <div className="absolute bottom-16 left-8 space-y-3">
                <div className="h-4 w-28 rounded" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                <div className="h-10 w-72 rounded" style={{ backgroundColor: "rgba(255,255,255,0.08)" }} />
                <div className="h-4 w-56 rounded" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Search bar */}
      <div
        className={`sticky ${searching ? "top-14" : "top-auto"} z-30 px-4 sm:px-8 py-4`}
        style={{ background: searching ? "rgba(5,5,5,0.96)" : "transparent", backdropFilter: searching ? "blur(8px)" : "none" }}
      >
        <div
          className="flex items-center gap-3 rounded-xl px-4 py-3 max-w-lg"
          style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: "rgba(255,255,255,0.40)" }} />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSearching(e.target.value.length > 0); }}
            placeholder="Search by skill, role, or country…"
            className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
          />
          {query && (
            <button onClick={() => { setQuery(""); setSearching(false); }} style={{ color: "rgba(255,255,255,0.40)" }}>
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search results */}
      {searching && (
        <div className="px-4 sm:px-8 pb-16">
          <p className="text-sm mb-4" style={{ color: "rgba(255,255,255,0.40)" }}>
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>
          {searchResults.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {searchResults.map((t) => (
                <TalentCard key={t.id} talent={t} size="md" onClick={() => setSelectedTalent(t)} />
              ))}
            </div>
          ) : (
            <p className="text-white/30 text-sm">No talent found matching your search.</p>
          )}
        </div>
      )}

      {/* Netflix rows */}
      {!searching && (
        <div className="pt-4 pb-16">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonRow key={i} />)
          ) : (
            SECTOR_ROWS.map(({ label, filter }) => (
              <TalentRow
                key={label}
                label={label}
                talents={allTalent.filter(filter)}
                onSelect={setSelectedTalent}
              />
            ))
          )}
        </div>
      )}

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
