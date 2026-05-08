// ============================================================
// PLATFORM CONFIGURATION
// Change this file to rebrand the entire platform.
// Every app imports from @platform/config.
// ============================================================

export const platformConfig = {
  name: "African Talent Platform",
  shortName: "AfriTalent",
  tagline: "Curated African talent for global teams",
  description:
    "A curated marketplace connecting exceptional African remote talent with global companies seeking to build distributed teams.",

  domain: "afritalent.com",
  supportEmail: "support@afritalent.com",
  contactEmail: "hello@afritalent.com",

  social: {
    twitter: "https://twitter.com/afritalent",
    linkedin: "https://linkedin.com/company/afritalent",
  },

  colors: {
    primary: "#1B4FD8",
    secondary: "#10B981",
    accent: "#F59E0B",
    background: "#0F172A",
  },

  cohort: {
    currentNumber: 1,
    maxSize: 500,
    // One-time activation fee paid AFTER approval. No subscription.
    // Active for 90 days (3 months), then talent must reapply and pay again.
    activationFee: 25,       // USD — paid once per cohort period
    periodDays: 90,          // Days active after payment
    applicationFee: 25,      // kept for backward compat
  },

  // Company access: FREE to use the platform.
  companyAccess: {
    browsing: { price: 0, label: "Free" },
    jobPost: { price: 49, label: "Job Post", note: "Phase 2 — not yet live" },
  },

  features: {
    waitlistMode: true,
    applicationsOpen: false,
    paymentsEnabled: true,    // Paystack integration live
    inAppMessaging: false,
    aiMatching: false,
    videoIntroductions: false,
  },

  seo: {
    titleTemplate: "%s | African Talent Platform",
    defaultTitle: "African Talent Platform — Curated African Remote Talent",
    ogImage: "/og-image.png",
  },
} as const;

// ============================================================
// COMPENSATION RANGE — flat $400–$2,500/month platform-wide
// ============================================================
export const COMPENSATION_RANGE = { min: 400, max: 2500 };

export const COMPENSATION_RANGES: Record<string, { min: number; max: number }> = Object.fromEntries(
  [
    "NG","KE","GH","ZA","EG","ET","RW","TZ","UG","SN","CI","MA","TN","DZ","CM",
    "ZW","ZM","BW","NA","MZ","AO","SD","MG","MW","ML","NE","BF","TD","GN","BJ",
    "TG","SL","LR","GM","GA","MU","DEFAULT",
  ].map((code) => [code, { min: 400, max: 2500 }])
);

export function getCompensationRange(countryCode: string) {
  return COMPENSATION_RANGES[countryCode] ?? COMPENSATION_RANGES.DEFAULT;
}

export type PlatformConfig = typeof platformConfig;
export const { name, shortName, tagline, domain } = platformConfig;
