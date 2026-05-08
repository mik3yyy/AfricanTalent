// ============================================================
// SHARED TYPES — used across all apps and the Flutter app
// ============================================================

export type UserRole = "talent" | "company" | "admin";

export type RoleCategory =
  | "developer"
  | "designer"
  | "product_manager"
  | "video_editor"
  | "content_creator";

export type EmploymentType = "full_time" | "contract" | "part_time";

export type AvailabilityStatus =
  | "immediate"
  | "two_weeks"
  | "one_month"
  | "three_months";

export type ApplicationStatus =
  | "draft"
  | "pending_review"
  | "approved"
  | "rejected"
  | "waitlist";

export type SubscriptionStatus = "trial" | "active" | "expired" | "cancelled";

export type TalentSubscriptionTier = "standard" | "featured";

export type CompanySubscriptionTier = "scout" | "recruiter" | "enterprise";

export type ContactRequestStatus =
  | "pending"
  | "accepted"
  | "declined"
  | "expired";

// ============================================================
// ENTITY TYPES
// ============================================================

export interface User {
  id: string;
  email: string;
  googleId: string;
  role: UserRole;
  createdAt: string;
  lastLogin: string;
}

export interface TalentProfile {
  id: string;
  userId: string;

  // Basic
  fullName: string;
  headline: string;
  location: string;
  timezone: string;
  avatarUrl?: string;

  // Professional
  roleCategory: RoleCategory;
  yearsExperience: number;
  bio: string;
  primarySkills: string[];
  secondarySkills: string[];

  // Work preferences
  employmentType: EmploymentType;
  availability: AvailabilityStatus;
  remoteOnly: boolean;
  willingToRelocate: boolean;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency: string;

  // Links
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  dribbbleUrl?: string;
  websiteUrl?: string;

  // Status
  applicationStatus: ApplicationStatus;
  cohortNumber?: number;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionTier?: TalentSubscriptionTier;
  subscriptionExpiresAt?: string;

  // Analytics
  profileViews: number;
  searchAppearances: number;
  contactRequests: number;

  createdAt: string;
  updatedAt: string;
}

export interface CompanyProfile {
  id: string;
  userId: string;

  companyName: string;
  companyWebsite?: string;
  companySize: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
  industry: string;
  description?: string;
  logoUrl?: string;

  subscriptionTier: CompanySubscriptionTier;
  subscriptionStatus: SubscriptionStatus;
  subscriptionExpiresAt?: string;
  monthlyContactLimit: number;
  contactsUsedThisMonth: number;
  contactsResetDate: string;

  createdAt: string;
  updatedAt: string;
}

export interface Application {
  id: string;
  talentId: string;
  cohortNumber: number;
  whyJoin: string;
  portfolioProjects: PortfolioProject[];
  applicationFeePaid: boolean;
  applicationFeeAmount: number;
  applicationFeePaidAt?: string;
  status: ApplicationStatus;
  reviewedById?: string;
  reviewedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortfolioProject {
  title: string;
  url: string;
  description: string;
}

export interface ContactRequest {
  id: string;
  companyId: string;
  talentId: string;
  message: string;
  status: ContactRequestStatus;
  respondedAt?: string;
  createdAt: string;
}

export interface SavedCandidate {
  id: string;
  companyId: string;
  talentId: string;
  folderName?: string;
  notes?: string;
  createdAt: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  firstName?: string;
  role: string;
  source: "organic" | "referral" | "social" | "email";
  notified: boolean;
  createdAt: string;
}

export interface Cohort {
  id: string;
  number: number;
  name: string;
  maxSize: number;
  openAt: string;
  closeAt: string;
  isActive: boolean;
  announcedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// API TYPES
// ============================================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface SearchFilters {
  query?: string;
  roleCategory?: RoleCategory;
  minExperience?: number;
  maxExperience?: number;
  location?: string;
  availability?: AvailabilityStatus;
  employmentType?: EmploymentType;
  minSalary?: number;
  maxSalary?: number;
  skills?: string[];
}

// Label maps for display
export const ROLE_CATEGORY_LABELS: Record<RoleCategory, string> = {
  developer: "Developer",
  designer: "Designer",
  product_manager: "Product Manager",
  video_editor: "Video Editor",
  content_creator: "Content Creator",
};

export const AVAILABILITY_LABELS: Record<AvailabilityStatus, string> = {
  immediate: "Immediately",
  two_weeks: "2 Weeks",
  one_month: "1 Month",
  three_months: "3 Months",
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: "Full-time",
  contract: "Contract",
  part_time: "Part-time",
};

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  draft: "Draft",
  pending_review: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
  waitlist: "Waitlisted",
};
