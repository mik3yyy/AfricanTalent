# Platform Monorepo

A two-sided marketplace connecting African remote talent with global companies.

## Rename the Platform

**Edit one file:** `packages/config/src/index.ts`

Change `name`, `shortName`, `tagline`, `domain`, `colors`, etc. — all 4 web apps and the Flutter app will reflect the new name immediately. No search-and-replace needed.

For the Flutter app, also edit: `apps/flutter/lib/config/platform_config.dart`

## Project Structure

```
.
├── apps/
│   ├── web/          → Waitlist/marketing site         (port 3000)
│   ├── talent/       → Candidate/talent portal         (port 3001)
│   ├── company/      → Company/client portal           (port 3002)
│   ├── admin/        → Admin panel                     (port 3003)
│   └── flutter/      → Mobile app (Phase 2 scaffold)
├── packages/
│   ├── config/       → Platform name & branding config ← THE RENAME FILE
│   ├── database/     → Prisma schema + Supabase client
│   ├── types/        → Shared TypeScript types
│   └── ui/           → Shared utility functions
└── setup.sh          → One-command setup
```

## Quick Start

```bash
# 1. Run setup
./setup.sh

# 2. Configure environment (edit each app's .env.local with Supabase credentials)

# 3. Push database schema
cd packages/database && npm run db:push

# 4. Start development servers
npm run dev:web      # Waitlist site
npm run dev:talent   # Talent portal
npm run dev:company  # Company portal
npm run dev:admin    # Admin panel

# Or start all at once
npm run dev
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Auth | Google OAuth via Supabase Auth |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Email | Resend |
| Analytics | PostHog |
| Hosting | Vercel |
| Mobile | Flutter (Phase 2) |

## Apps Overview

### `apps/web` — Waitlist Site
Landing page with email collection, pricing, FAQ. Converts visitors to waitlist signups.

### `apps/talent` — Talent Portal
Where African professionals:
- Sign in with Google
- Complete multi-step profile creation
- View dashboard (profile views, contact requests, search appearances)
- Manage their profile and application

### `apps/company` — Company Portal
Where global companies:
- Sign in with Google
- Search and filter talent by skills, location, salary, availability
- View full talent profiles
- Request contact (limited by subscription tier)
- Save candidates to folders

### `apps/admin` — Admin Panel
Internal tool for:
- Reviewing applications (Approve / Reject / Waitlist)
- Managing cohorts (open/close, view stats)
- Monitoring platform metrics
- Managing members and companies

## Database Schema

See `packages/database/prisma/schema.prisma` for the full schema.

Core tables:
- `users` — Auth, roles
- `talent_profiles` — Candidate data, skills, preferences
- `company_profiles` — Company data, subscription
- `applications` — Cohort applications with review status
- `contact_requests` — Company → Talent contact history
- `saved_candidates` — Company folder system
- `waitlist_entries` — Pre-launch email collection
- `cohorts` — Cohort management

## Environment Setup

1. Create a [Supabase](https://supabase.com) project
2. Enable Google provider in Supabase → Authentication → Providers
3. Add OAuth redirect URLs for each app:
   - `http://localhost:3001/auth/callback` (talent dev)
   - `http://localhost:3002/auth/callback` (company dev)
   - `http://localhost:3003/auth/callback` (admin dev)
4. Copy `.env.example` to `.env.local` in each app and fill in credentials

## Revenue Model

**Talent Side:**
- Application fee: $25 (one-time)
- Standard: $15/month or $180/year
- Featured: $25/month or $300/year

**Company Side:**
- Scout: $99/month (10 contacts)
- Recruiter: $299/month (unlimited)
- Enterprise: $799/month (multi-seat)

## Phase 1 (Current) vs Phase 2

| Feature | Phase 1 | Phase 2 |
|---------|---------|---------|
| Payments | Manual invoicing | Stripe integration |
| Messaging | Email notifications | In-app chat |
| Matching | Keyword search | AI recommendations |
| Mobile | — | Flutter app |
| Skill tests | Manual review | Automated |
