/**
 * All admin data operations go through the Flask Python API.
 * Server-side only — uses the admin credentials from env.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001";
const ADMIN_EMAIL = process.env.API_ADMIN_EMAIL ?? "admin@africantalent.com";
const ADMIN_PASSWORD = process.env.API_ADMIN_PASSWORD ?? "admin123";

let _cachedToken: string | null = null;
let _tokenExpiry = 0;

async function getAdminToken(): Promise<string> {
  if (_cachedToken && Date.now() < _tokenExpiry) return _cachedToken;

  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Admin login failed");
  const { token } = await res.json() as { token: string };
  _cachedToken = token;
  _tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;
  return token;
}

async function apiGet(path: string) {
  const token = await getAdminToken();
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Authorization": `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API GET ${path} failed: ${res.status}`);
  return res.json();
}

async function apiPatch(path: string, body: Record<string, unknown>) {
  const token = await getAdminToken();
  const res = await fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API PATCH ${path} failed: ${res.status}`);
  return res.json();
}

async function apiPost(path: string, body: Record<string, unknown>) {
  const token = await getAdminToken();
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API POST ${path} failed: ${res.status}`);
  return res.json();
}

async function apiDelete(path: string) {
  const token = await getAdminToken();
  const res = await fetch(`${API_URL}${path}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API DELETE ${path} failed: ${res.status}`);
  return res.json();
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type ApplicationStatus = "pending" | "approved" | "rejected" | "waitlist";

export interface TalentUser {
  id: string;
  email: string;
  name: string;
  headline: string;
  bio: string;
  location: string;
  country: string;
  profilePhotoUrl: string;
  coverMediaUrl?: string;
  sectors: string[];
  primarySkills: string[];
  secondarySkills: string[];
  yearsOfExperience: number;
  availability: string;
  employmentType: string[];
  compensationMin: number;
  compensationMax: number;
  portfolioLinks: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    twitter?: string;
    dribbble?: string;
  };
  resumeUrl?: string;
  featured: boolean;
  applicationStatus: ApplicationStatus;
  adminNotes?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface CompanyUser {
  id: number;
  email: string;
  companyName?: string;
  website?: string;
  industry?: string;
  teamSize?: string;
  contactName?: string;
  jobTitle?: string;
  city?: string;
  country?: string;
  plan: string;
  status: string;
  joinedDate: string;
}

export interface Stats {
  talent: number;
  approved: number;
  pending: number;
  rejected: number;
  companies: number;
}

export interface CohortData {
  id: number;
  name: string;
  isOpen: boolean;
  maxSize: number;
  approved: number;
  pending: number;
  createdAt: string;
}

// ─── Data functions ───────────────────────────────────────────────────────────

export async function getAllTalent(): Promise<TalentUser[]> {
  try {
    const { talent } = await apiGet("/api/admin/talent");
    return talent as TalentUser[];
  } catch {
    return [];
  }
}

export async function getTalentById(id: string): Promise<TalentUser | null> {
  try {
    const { talent } = await apiGet(`/api/admin/talent/${id}`);
    return talent as TalentUser;
  } catch {
    return null;
  }
}

export async function getAllCompanies(): Promise<CompanyUser[]> {
  try {
    const { companies } = await apiGet("/api/admin/companies");
    return companies as CompanyUser[];
  } catch {
    return [];
  }
}

export async function getStats(): Promise<Stats> {
  try {
    return (await apiGet("/api/admin/stats")) as Stats;
  } catch {
    return { talent: 0, approved: 0, pending: 0, rejected: 0, companies: 0 };
  }
}

export async function getAllCohorts(): Promise<CohortData[]> {
  try {
    const { cohorts } = await apiGet("/api/admin/cohorts");
    return cohorts as CohortData[];
  } catch {
    return [];
  }
}

export async function createCohort(data: { name: string; isOpen: boolean; maxSize: number }): Promise<CohortData | null> {
  try {
    const { cohort } = await apiPost("/api/admin/cohorts", data);
    return cohort as CohortData;
  } catch {
    return null;
  }
}

export async function updateCohort(id: number, data: Partial<{ name: string; isOpen: boolean; maxSize: number }>): Promise<CohortData | null> {
  try {
    const { cohort } = await apiPatch(`/api/admin/cohorts/${id}`, data);
    return cohort as CohortData;
  } catch {
    return null;
  }
}

export async function deleteCohort(id: number): Promise<boolean> {
  try {
    await apiDelete(`/api/admin/cohorts/${id}`);
    return true;
  } catch {
    return false;
  }
}

export async function updateTalentStatus(
  id: string,
  status: ApplicationStatus,
  notes?: string,
  rejectionReason?: string
): Promise<TalentUser | null> {
  try {
    const body: Record<string, unknown> = { status };
    if (notes !== undefined) body.notes = notes;
    if (rejectionReason !== undefined) body.rejectionReason = rejectionReason;
    const { talent } = await apiPatch(`/api/admin/talent/${id}/status`, body);
    return talent as TalentUser;
  } catch {
    return null;
  }
}
