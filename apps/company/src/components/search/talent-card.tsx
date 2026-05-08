"use client";

import Link from "next/link";
import type { TalentProfile } from "@/lib/mock-data";
import { TalentImage } from "@/components/ui/talent-image";

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

interface TalentCardProps {
  talent: TalentProfile;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function TalentCard({ talent, size = "md", onClick }: TalentCardProps) {
  const sizeClasses = {
    sm: "w-28 flex-shrink-0",
    md: "w-36 flex-shrink-0",
    lg: "w-44 flex-shrink-0",
  }[size];

  const sector = talent.sectors[0];
  const sectorLabel = SECTOR_LABELS[sector] ?? sector;

  const inner = (
    <div
      className="relative aspect-[3/4] rounded-xl overflow-hidden group cursor-pointer"
      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105 group-hover:brightness-110">
        <TalentImage
          src={talent.profilePhotoUrl}
          alt={talent.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Subtle hover tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />

      {/* Bottom gradient + info */}
      <div
        className="absolute inset-x-0 bottom-0 p-2.5"
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
        }}
      >
        <p className="text-white font-semibold text-xs leading-tight truncate">{talent.name}</p>
        <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
          {sectorLabel}
        </p>
      </div>

      {/* Featured badge */}
      {talent.featured && (
        <div
          className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-xs font-bold"
          style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#ffffff", fontSize: "9px", letterSpacing: "0.05em" }}
        >
          TOP
        </div>
      )}
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={sizeClasses} style={{ textAlign: "left" }}>
        {inner}
      </button>
    );
  }

  return (
    <Link href={`/talent/${talent.id}`} className={sizeClasses}>
      {inner}
    </Link>
  );
}
