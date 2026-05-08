/**
 * Fetches talent data from the Flask Python API.
 * API runs at NEXT_PUBLIC_API_URL (default: http://localhost:5001)
 */
import type { TalentProfile } from "./mock-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";

function mapProfile(p: Record<string, unknown>): TalentProfile {
  const links = (p.portfolioLinks ?? {}) as Record<string, string>;
  return {
    id: p.id as string,
    name: p.name as string,
    headline: p.headline as string,
    bio: p.bio as string,
    location: p.location as string,
    country: p.country as string,
    profilePhotoUrl: (p.profilePhotoUrl as string) ?? "",
    coverMediaUrl: (p.coverMediaUrl as string) || undefined,
    sectors: (p.sectors as string[]) ?? [],
    primarySkills: (p.primarySkills as string[]) ?? [],
    secondarySkills: (p.secondarySkills as string[]) ?? [],
    yearsOfExperience: (p.yearsOfExperience as number) ?? 0,
    availability: (p.availability as TalentProfile["availability"]) ?? "1 month",
    employmentType: (p.employmentType as TalentProfile["employmentType"]) ?? [],
    compensationMin: (p.compensationMin as number) ?? 0,
    compensationMax: (p.compensationMax as number) ?? 0,
    portfolioLinks: {
      github: links.github || undefined,
      linkedin: links.linkedin || undefined,
      portfolio: links.portfolio || undefined,
      twitter: links.twitter || undefined,
      dribbble: links.dribbble || undefined,
    },
    resumeUrl: (p.resumeUrl as string) || undefined,
    featured: (p.featured as boolean) ?? false,
  };
}

export async function getAllTalent(): Promise<TalentProfile[]> {
  try {
    const res = await fetch(`${API_URL}/api/talent`, { cache: "no-store" });
    if (!res.ok) return [];
    const { talent } = await res.json() as { talent: Record<string, unknown>[] };
    return (talent ?? []).map(mapProfile);
  } catch {
    return [];
  }
}

export async function getTalentById(id: string): Promise<TalentProfile | null> {
  try {
    const res = await fetch(`${API_URL}/api/talent/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const { talent } = await res.json() as { talent: Record<string, unknown> };
    return talent ? mapProfile(talent) : null;
  } catch {
    return null;
  }
}
