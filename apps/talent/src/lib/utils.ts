import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function calculateProfileCompletion(profile: Record<string, unknown>): {
  percentage: number;
  missing: string[];
} {
  const fields: { key: string; label: string }[] = [
    { key: "full_name", label: "Full name" },
    { key: "headline", label: "Professional headline" },
    { key: "location", label: "Location" },
    { key: "bio", label: "Bio" },
    { key: "role_category", label: "Role category" },
    { key: "primary_skills", label: "Primary skills" },
    { key: "employment_type", label: "Employment type" },
    { key: "availability", label: "Availability" },
    { key: "linkedin_url", label: "LinkedIn profile" },
    { key: "avatar_url", label: "Profile photo" },
    { key: "resume_url", label: "Resume / CV" },
    { key: "why_join", label: "Why you want to join" },
  ];

  const missing: string[] = [];

  for (const field of fields) {
    const value = profile[field.key];
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0)
    ) {
      missing.push(field.label);
    }
  }

  const percentage = Math.round(
    ((fields.length - missing.length) / fields.length) * 100
  );

  return { percentage, missing };
}
