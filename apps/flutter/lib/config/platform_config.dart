// ============================================================
// PLATFORM CONFIGURATION — Flutter App
// Change this file to rebrand the entire Flutter app.
// Mirrors packages/config/src/index.ts in the web monorepo.
// ============================================================

class PlatformConfig {
  // Core identity — change these to rename the platform
  static const String name = 'African Talent Platform';
  static const String shortName = 'AfriTalent';
  static const String tagline = 'Curated African talent for global teams';
  static const String description =
      'A curated, two-sided marketplace connecting exceptional African remote talent with global companies.';

  // Domain
  static const String domain = 'afritalent.com';
  static const String supportEmail = 'support@afritalent.com';
  static const String contactEmail = 'hello@afritalent.com';

  // API base URL (point to your Next.js backend)
  static const String apiBaseUrl = 'https://api.afritalent.com';

  // Brand colors
  static const int primaryColor = 0xFF1B4FD8;
  static const int secondaryColor = 0xFF10B981;
  static const int accentColor = 0xFFF59E0B;
  static const int backgroundColor = 0xFF0F172A;

  // Supabase (set before running the app)
  static const String supabaseUrl = 'https://your-project.supabase.co';
  static const String supabaseAnonKey = 'your-anon-key';

  // Cohort settings
  static const int currentCohortNumber = 1;
  static const int cohortMaxSize = 500;
  static const double applicationFee = 25.0;

  // Talent pricing
  static const double standardPriceMonthly = 15.0;
  static const double featuredPriceMonthly = 25.0;

  // Company pricing
  static const double scoutPrice = 99.0;
  static const double recruiterPrice = 299.0;
  static const double enterprisePrice = 799.0;
}
