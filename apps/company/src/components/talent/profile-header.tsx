"use client";

import { MapPin, Briefcase, DollarSign, Clock, Github, Linkedin, Globe, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { TalentProfile } from "@/lib/mock-data";

interface ProfileHeaderProps {
  talent: TalentProfile;
  onRequestContact: () => void;
  onSaveToFolder: () => void;
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
};

const availabilityVariant: Record<string, "success" | "warning" | "danger" | "default"> = {
  Immediate: "success",
  "2 weeks": "warning",
  "1 month": "warning",
  "3 months": "default",
};

export function ProfileHeader({ talent, onRequestContact, onSaveToFolder }: ProfileHeaderProps) {
  const initials = talent.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-gray-800 to-gray-900" />
      <div className="px-8 pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4 -mt-8">
          <div className="relative">
            <div className="h-20 w-16 rounded-xl border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-lg" style={{ aspectRatio: "3/4" }}>
              {talent.profilePhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={talent.profilePhotoUrl}
                  alt={talent.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-gray-600">{initials}</span>
              )}
            </div>
            {talent.featured && (
              <span className="absolute -top-1 -right-1 rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white shadow">
                TOP
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onSaveToFolder}>
              Save
            </Button>
            <Button variant="primary" onClick={onRequestContact}>
              Contact
            </Button>
          </div>
        </div>

        <div className="mt-5">
          <h1 className="text-2xl font-bold text-gray-900">{talent.name}</h1>
          <p className="text-base text-gray-600 mt-1">{talent.headline}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-gray-400" />
            {talent.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-gray-400" />
            {talent.yearsOfExperience} years exp
          </span>
          <span className="flex items-center gap-1.5">
            <DollarSign className="h-4 w-4 text-gray-400" />
            ${talent.compensationMin.toLocaleString()}–${talent.compensationMax.toLocaleString()}/mo
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-gray-400" />
            <Badge variant={availabilityVariant[talent.availability] ?? "default"}>
              {talent.availability}
            </Badge>
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {talent.sectors.map((s) => (
            <Badge key={s} variant="secondary">
              {SECTOR_LABELS[s] ?? s}
            </Badge>
          ))}
          {talent.employmentType.map((type) => (
            <Badge key={type} variant="outline">{type}</Badge>
          ))}
        </div>

        {Object.values(talent.portfolioLinks).some(Boolean) && (
          <div className="mt-5 flex flex-wrap gap-3">
            {talent.portfolioLinks.github && (
              <a href={talent.portfolioLinks.github} target="_blank" rel="noopener noreferrer"
                className={cn("flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors")}>
                <Github className="h-4 w-4" /> GitHub
              </a>
            )}
            {talent.portfolioLinks.linkedin && (
              <a href={talent.portfolioLinks.linkedin} target="_blank" rel="noopener noreferrer"
                className={cn("flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors")}>
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
            {talent.portfolioLinks.dribbble && (
              <a href={talent.portfolioLinks.dribbble} target="_blank" rel="noopener noreferrer"
                className={cn("flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors")}>
                <Layers className="h-4 w-4" /> Dribbble
              </a>
            )}
            {talent.portfolioLinks.portfolio && (
              <a href={talent.portfolioLinks.portfolio} target="_blank" rel="noopener noreferrer"
                className={cn("flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors")}>
                <Globe className="h-4 w-4" /> Portfolio
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
