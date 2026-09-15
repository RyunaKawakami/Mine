# Mine — Architecture and Implementation Plan

Status: Approved — Phase 1 implemented
Last updated: 2026-09-15

## 1. Specification review

Mine is a private, photo-first travel album for a couple. Its core experience is not trip administration; it is revisiting shared memories through a map of Japan, places, dates, typography, and photographs.

The MVP has these user journeys:

1. Sign in with Google.
2. See visited prefectures on an interactive Japan map.
3. Open a prefecture and browse related trips and photos.
4. Open a trip and browse its photos, places, and notes.
5. Create or edit a trip with multiple prefectures, spots, and photos.
6. Browse all memories chronologically and view simple statistics.

The workspace was empty when this review began. The plan was approved before application work started, and Phase 1 now provides the verified project foundation.

## 2. Decisions and open points

### Zero-cost constraint

The application must remain free to develop and operate during the MVP:

- Use open-source local tooling and free service plans only.
- Do not enter payment details, start paid trials, upgrade plans, buy a custom domain, or enable pay-as-you-go billing.
- Prefer free plans that suspend or reject usage after their allowance instead of creating overage charges.
- Use Vercel Hobby, Neon Free, the Vercel Blob Hobby allowance, and the default `vercel.app` domain.
- If a provider asks to enable billing, stop that setup and select a free alternative or request explicit approval. Silence is never approval to incur a charge.
- Recheck official pricing and limits immediately before connecting any hosted service because free plans can change.
- When a free allowance is reached, reduced availability is acceptable; automatic paid continuation is not.

### Recommended decisions

| Area                | Decision                                                                         | Reason                                                                                                                   |
| ------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Privacy boundary    | Add `Album` and `AlbumMember`                                                    | Authentication identifies a person; an album membership determines which private data they may access.                   |
| Two-person setup    | Allowlisted Google accounts in `MINE_ALLOWED_EMAILS` for MVP                     | Smallest secure onboarding flow for a private two-user deployment. Replace with invitations later.                       |
| Trip participation  | Explicit `TripParticipant` join model                                            | Supports both users today and more users later without changing the relation shape.                                      |
| Visited prefectures | Explicit `TripPrefecture` join model                                             | `visited` remains derived; visit and photo counts come from relations.                                                   |
| Mutations           | Server Functions/Actions                                                         | Avoids building duplicate internal REST endpoints. Route Handlers remain for Auth.js and storage callbacks/signatures.   |
| Authorization       | Central server-only DAL plus checks in every mutation                            | UI hiding and route-level checks are not security boundaries.                                                            |
| Production database | Neon Free PostgreSQL                                                             | No-card free plan, simple Vercel integration, and standard PostgreSQL portability. Local development may use PostgreSQL. |
| Images              | Vercel Private Blob on Hobby, behind a `StorageService` interface                | Private delivery matches the product promise; Hobby usage stops at its free allowance instead of creating overages.      |
| Japan map           | Local, optimized SVG with one accessible interactive element per prefecture      | No runtime map API is required and the map remains keyboard-operable.                                                    |
| Date handling       | Trip dates are date-only; timestamps are stored in UTC and shown in `Asia/Tokyo` | Prevents a trip date shifting because of timezone conversion.                                                            |

### Items requiring approval before their dependent phase

1. Confirm the MVP membership rule: exactly the two email addresses in `MINE_ALLOWED_EMAILS` share one album.
2. Confirm Neon Free for production PostgreSQL, or select another no-card free provider.
3. Confirm Vercel Private Blob within the Hobby allowance for production image storage.
4. Confirm the maximum upload policy. Proposal: JPEG, PNG, WebP, and HEIC input; 15 MB per source image; 30 photos per trip. HEIC support must be verified against the chosen upload pipeline.
5. Select or approve the licensed SVG source for the 47 prefectures before Phase 7.
6. Confirm deletion behavior. Proposal: deleting a trip permanently removes its database records and queues its cloud images for deletion after explicit confirmation.

None of items 2–5 blocks project scaffolding. Item 1 must be settled before the authentication phase is considered complete.

## 3. Final technology stack

Use stable major versions and commit the package-manager lockfile. Patch/minor versions are selected when Phase 1 begins and are upgraded deliberately.

| Concern                | Selection                                                       |
| ---------------------- | --------------------------------------------------------------- |
| Runtime                | Node.js 24 LTS                                                  |
| Package manager        | pnpm 10                                                         |
| Application            | Next.js 16 App Router, React 19, TypeScript strict mode         |
| Styling                | Tailwind CSS 4, CSS custom properties for design tokens         |
| Icons                  | Lucide React                                                    |
| Database               | PostgreSQL                                                      |
| ORM                    | Prisma ORM 7.x initially                                        |
| Authentication         | Auth.js with Google OAuth and Prisma adapter; database sessions |
| Validation             | Zod                                                             |
| Forms                  | React Hook Form plus `@hookform/resolvers`                      |
| Image storage          | Vercel Private Blob through an application-owned adapter        |
| Unit/integration tests | Vitest and Testing Library                                      |
| Browser tests          | Playwright                                                      |
| Code quality           | ESLint, Prettier, TypeScript `noUncheckedIndexedAccess`         |
| Deployment             | Vercel                                                          |

Prisma 8 is current, but Prisma 7 remains supported and has the lower integration risk with the Auth.js Prisma adapter and the conventional schema/migration workflow. Re-evaluate Prisma 8 after the authentication spike; do not mix both setup styles.

## 4. Application architecture

### Dependency direction

```text
app/page or feature component
        ↓
feature query / server action
        ↓
feature service (business rules and authorization)
        ↓
feature repository / storage port
        ↓
Prisma / Vercel Blob
```

Rules:

- Pages compose features and own route metadata, loading, not-found, and error boundaries.
- React components never import Prisma.
- Repositories are server-only and return small view models rather than raw database objects where practical.
- Every read or write scopes its query by the authenticated user's `AlbumMember` record. Checking only `trip.id` is forbidden.
- Server Actions parse unknown input with Zod, authenticate, authorize, call a service, and return a typed result.
- Route Handlers are not created for internal CRUD unless a real HTTP consumer exists.
- Client Components are limited to interaction boundaries such as forms, file selection, and map hover/tap state.
- Storage details stay behind `StorageService`; the database stores provider-neutral `storageKey` values. Stored Blob URLs are private and are never treated as authorization.
- Empty, loading, error, not-found, and unauthorized states are designed with each feature, not deferred to a final cleanup.

### Proposed directory structure

```text
.
├─ docs/
│  └─ architecture-plan.md
├─ prisma/
│  ├─ migrations/
│  ├─ schema.prisma
│  └─ seed.ts
├─ public/
│  ├─ icons/
│  ├─ images/
│  └─ map/
│     └─ japan-prefectures.svg
├─ src/
│  ├─ app/
│  │  ├─ (auth)/
│  │  │  └─ login/page.tsx
│  │  ├─ (main)/
│  │  │  ├─ layout.tsx
│  │  │  ├─ page.tsx
│  │  │  ├─ loading.tsx
│  │  │  ├─ error.tsx
│  │  │  ├─ memories/page.tsx
│  │  │  ├─ prefectures/[id]/page.tsx
│  │  │  ├─ profile/page.tsx
│  │  │  └─ trips/
│  │  │     ├─ new/page.tsx
│  │  │     └─ [id]/
│  │  │        ├─ page.tsx
│  │  │        └─ edit/page.tsx
│  │  ├─ api/auth/[...nextauth]/route.ts
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ not-found.tsx
│  ├─ components/
│  │  ├─ feedback/
│  │  ├─ layout/
│  │  └─ ui/
│  ├─ config/
│  │  ├─ env.ts
│  │  ├─ navigation.ts
│  │  └─ site.ts
│  ├─ constants/
│  │  └─ prefectures.ts
│  ├─ features/
│  │  ├─ auth/{actions,components,services,types}/
│  │  ├─ map/{components,data,types,utils}/
│  │  ├─ memories/{components,queries,types}/
│  │  ├─ photos/{actions,components,repositories,schemas,services,types}/
│  │  ├─ prefectures/{components,queries,repositories,types}/
│  │  ├─ profile/{components,queries,types}/
│  │  ├─ spots/{actions,components,repositories,schemas,services,types}/
│  │  └─ trips/{actions,components,queries,repositories,schemas,services,types,utils}/
│  ├─ generated/prisma/
│  ├─ lib/
│  │  ├─ auth/
│  │  │  ├─ authorize.ts
│  │  │  └─ session.ts
│  │  ├─ db/prisma.ts
│  │  ├─ storage/
│  │  │  ├─ vercel-blob-storage.ts
│  │  │  └─ storage.ts
│  │  └─ utils/
│  ├─ auth.ts
│  └─ proxy.ts
├─ tests/
│  ├─ integration/
│  └─ unit/
├─ e2e/
├─ .env.example
├─ prisma.config.ts
└─ package.json
```

Directories should be created only when first used. The tree describes ownership, not a requirement to add empty folders.

## 5. Prisma schema draft

This is a design draft for Prisma ORM 7, not yet an applied migration.

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum AlbumRole {
  OWNER
  MEMBER
}

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  accounts      Account[]
  sessions      Session[]
  albums        AlbumMember[]
  createdTrips  Trip[]    @relation("TripCreator")
  trips         TripParticipant[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@index([userId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}

model VerificationToken {
  identifier String
  token      String
  expires    DateTime

  @@unique([identifier, token])
}

model Album {
  id        String   @id @default(cuid())
  slug      String   @unique
  name      String   @default("Mine")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  members AlbumMember[]
  trips   Trip[]
}

model AlbumMember {
  albumId String
  userId  String
  role    AlbumRole @default(MEMBER)
  joinedAt DateTime @default(now())

  album Album @relation(fields: [albumId], references: [id], onDelete: Cascade)
  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([albumId, userId])
  @@index([userId])
}

model Trip {
  id          String   @id @default(cuid())
  albumId     String
  title       String   @db.VarChar(120)
  startDate   DateTime @db.Date
  endDate     DateTime @db.Date
  comment     String?  @db.Text
  createdById String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  album       Album             @relation(fields: [albumId], references: [id], onDelete: Cascade)
  createdBy   User              @relation("TripCreator", fields: [createdById], references: [id], onDelete: Restrict)
  participants TripParticipant[]
  prefectures  TripPrefecture[]
  spots        Spot[]
  photos       Photo[]

  @@index([albumId, startDate])
  @@index([createdById])
}

model TripParticipant {
  tripId String
  userId String

  trip Trip @relation(fields: [tripId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([tripId, userId])
  @@index([userId])
}

model Prefecture {
  id     Int    @id
  code   String @unique @db.VarChar(2)
  name   String @unique
  nameEn String @unique
  region String

  trips TripPrefecture[]
  spots Spot[]
}

model TripPrefecture {
  tripId       String
  prefectureId Int
  createdAt    DateTime @default(now())

  trip       Trip       @relation(fields: [tripId], references: [id], onDelete: Cascade)
  prefecture Prefecture @relation(fields: [prefectureId], references: [id], onDelete: Restrict)

  @@id([tripId, prefectureId])
  @@index([prefectureId, tripId])
}

model Spot {
  id           String    @id @default(cuid())
  tripId       String
  prefectureId Int
  name         String    @db.VarChar(120)
  comment      String?   @db.Text
  latitude     Decimal?  @db.Decimal(9, 6)
  longitude    Decimal?  @db.Decimal(9, 6)
  visitedAt    DateTime?
  position     Int       @default(0)
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  trip       Trip       @relation(fields: [tripId], references: [id], onDelete: Cascade)
  prefecture Prefecture @relation(fields: [prefectureId], references: [id], onDelete: Restrict)
  photos     Photo[]

  @@index([tripId, position])
  @@index([prefectureId])
}

model Photo {
  id         String    @id @default(cuid())
  tripId     String
  spotId     String?
  imageUrl   String    @db.Text
  storageKey String    @unique
  caption    String?   @db.VarChar(500)
  takenAt    DateTime?
  width      Int
  height     Int
  mimeType   String    @db.VarChar(100)
  bytes      Int
  position   Int       @default(0)
  createdAt  DateTime  @default(now())

  trip Trip  @relation(fields: [tripId], references: [id], onDelete: Cascade)
  spot Spot? @relation(fields: [spotId], references: [id], onDelete: SetNull)

  @@index([tripId, position])
  @@index([spotId])
  @@index([takenAt])
}
```

Application services must additionally enforce constraints Prisma cannot express simply:

- `endDate >= startDate`.
- Every participant is a member of the trip's album.
- Every spot's prefecture is included in the trip's `TripPrefecture` rows.
- A linked photo's spot belongs to the same trip.
- Latitude and longitude are either both absent or both valid and present.
- `storageKey`, dimensions, MIME type, and byte size come from the trusted upload result, not arbitrary client input.
- At least one prefecture is required for a completed create operation.

`visited` is never stored. A prefecture is visited when at least one authorized trip has a corresponding `TripPrefecture` row. Counts should count distinct trips and photos to avoid join multiplication.

## 6. Environment variables

```dotenv
# Application
AUTH_URL=http://localhost:3000
AUTH_SECRET=
MINE_ALLOWED_EMAILS=user-a@example.com,user-b@example.com

# Google OAuth
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# PostgreSQL
DATABASE_URL=

# Vercel Private Blob
BLOB_READ_WRITE_TOKEN=
```

Notes:

- Validate environment variables once on server startup with Zod.
- Do not expose `DATABASE_URL`, `AUTH_SECRET`, Google secret, or the Blob token to client code.
- Vercel preview and production environments use separate databases or isolated branches.
- OAuth callback URLs must be registered separately for local, preview policy, and production use. Arbitrary preview URLs are not automatically safe Google OAuth callbacks.
- `.env*` stays ignored; only `.env.example` is committed.

## 7. Phase plan and acceptance criteria

### Phase 1 — Project setup

Status: Complete (2026-09-15)

Tasks:

- Scaffold Next.js with App Router, `src/`, TypeScript, Tailwind, ESLint, and pnpm.
- Pin the selected major versions and commit `pnpm-lock.yaml`.
- Configure strict TypeScript, import aliases, formatting, linting, and test runners.
- Add environment validation, `.env.example`, design tokens, and a minimal health page.
- Add CI for typecheck, lint, unit tests, and production build.
- Write the initial README setup section.

Done when a clean checkout installs, lints, typechecks, tests, builds, and starts without external services using a documented setup path.

### Phase 2 — Database and Prisma

Depends on: Phase 1; database provider decision.

Status: Code complete (2026-09-15); migration, seed, and integration-test execution await a free PostgreSQL connection.

Tasks:

- Add Prisma 7, PostgreSQL driver adapter, config, schema, initial migration, and singleton client.
- Implement the approved schema and a repeatable seed for all 47 prefectures.
- Add repository boundaries and database test helpers.
- Test constraints, prefecture seed idempotency, and transaction rollback.

Done when migration and seed succeed on an empty database and all 47 prefectures have stable IDs/codes.

### Phase 3 — Google authentication and authorization boundary

Depends on: Phase 2; membership decision; Google OAuth credentials.

Status: Code complete (2026-09-15); live Google OAuth verification awaits the two approved emails and OAuth credentials.

Tasks:

- Configure Auth.js, Google provider, Prisma adapter, and database sessions.
- Build the branded login page and sign-in/sign-out actions.
- Bootstrap the single album for allowlisted accounts.
- Add `verifySession`, `requireAlbumMember`, and ownership-scoped DAL helpers.
- Add route-level optimistic redirects plus secure checks near every data access.
- Test denied email, unauthenticated access, cross-album access, and session expiry.

Done when only approved accounts can enter and an authenticated user cannot read or mutate another album by guessing an ID.

### Phase 4 — Base layout and responsive navigation

Depends on: Phase 1 and Phase 3.

Tasks:

- Implement color, typography, spacing, radius, shadow, focus, and motion tokens.
- Build `PageContainer`, shared feedback states, desktop header, and mobile bottom navigation.
- Add Map, Memories, Add, and Profile destinations; make Add visually prominent.
- Add responsive shells for home, login, and protected pages.
- Verify semantic landmarks, keyboard order, visible focus, safe-area insets, and 44px touch targets.
- Test 375px, 768px, and 1024px+ viewports.

Done when login and protected navigation work responsively, even though feature pages may still contain intentional empty states.

### Phase 5 — Trip CRUD

Depends on: Phases 2–4.

- Implement trip schemas, repositories, services, queries, actions, forms, list/card/detail views, and deletion confirmation.
- Create/update trip, participants, and the initial prefecture selection atomically.
- Test date validation, album scoping, participant membership, and empty states.

### Phase 6 — Prefecture relations and pages

Depends on: Phase 5 and seeded prefectures from Phase 2.

- Implement multi-prefecture selection, derived visited/count queries, and `/prefectures/[id]`.
- Prevent a prefecture from being removed while a spot still references it unless the user resolves the spot.
- Test distinct counts and multi-prefecture trips.

### Phase 7 — Interactive Japan map

Depends on: Phase 6; approved/licensed SVG geometry.

- Normalize and optimize the 47 prefecture paths.
- Implement visited/unvisited states, hover/tap/focus tooltip, keyboard activation, and navigation.
- Provide an accessible prefecture-list fallback and test map utilities.

### Phase 8 — Photo upload

Depends on: Phase 5; storage and upload-limit decisions.

- Implement authenticated client upload, server verification, metadata persistence, responsive image delivery, ordering, caption editing, and deletion cleanup.
- Build mobile multi-file selection with progress, retry, and partial-failure handling.
- Test MIME/size rejection, unauthorized signing, orphan cleanup, and gallery layout.

### Phase 9 — Spot management

Depends on: Phases 6 and 8.

- Implement repeatable spot fields, ordering, edit/delete, optional coordinates, optional dates, and optional photo association.
- Validate trip/prefecture/photo consistency in a transaction.

### Phase 10 — Memories

Depends on: Phases 5 and 8.

- Implement newest-first photo-led cards and pagination/cursor loading.
- Shape queries now for later year, prefecture, and favorite filters without adding unfinished controls.

### Phase 11 — Profile and statistics

Depends on: Phases 5, 6, and 8.

- Implement distinct visited-prefecture, trip, and photo counts scoped to the album.
- Add zero-state and query tests.

### Phase 12 — UI polish and responsive optimization

Depends on: Phases 7–11.

- Perform photo-first visual polish, motion-reduction support, image sizing, mobile form ergonomics, and all target-width checks.
- Audit text contrast, focus, labels, alt text, loading stability, and empty/error states.

### Phase 13 — Test and error hardening

Depends on: all feature phases. Tests are written throughout; this phase closes systemic gaps.

- Complete unit/integration coverage for validation, visited calculation, authorization, and storage behavior.
- Add Playwright critical paths: sign-in fixture, create/edit/view trip, map navigation, upload failure, and access denial.
- Add structured server logging without secrets, error boundaries, not-found behavior, and production build checks.

### Phase 14 — Documentation and release readiness

Depends on: Phase 13.

- Complete README, architecture summary, Mermaid ERD, environment/setup/migration/seed/deploy instructions, roadmap, screenshots, and license notices.
- Verify a fresh setup and production deployment checklist.
- Record intentionally deferred features and known limits.

Done when another developer can clone, configure, migrate, seed, test, build, and deploy from documentation alone.

## 8. Dependency summary

```text
Phase 1
  └─ Phase 2
      └─ Phase 3
          └─ Phase 4
              └─ Phase 5
                  └─ Phase 6
                      ├─ Phase 7
                      └─ Phase 9 ← Phase 8
                  ├─ Phase 8
                  ├─ Phase 10 ← Phase 8
                  └─ Phase 11 ← Phase 6 + Phase 8

Phases 7–11
  └─ Phase 12
      └─ Phase 13
          └─ Phase 14
```

Cross-cutting work starts earlier than its final phase: tests accompany every business rule, accessibility accompanies every UI component, and README setup notes are updated whenever configuration changes.

## 9. Explicitly deferred from the MVP

- Wanted/favorite destinations and trips.
- Year/prefecture/favorite filtering controls beyond query-ready architecture.
- Visit-frequency map colors.
- EXIF/GPS extraction and automatic prefecture detection.
- Google Maps, route maps, and calendar views.
- Social sharing assets, achievements, overseas travel, reactions, and expense tracking.
- General-purpose invitations, album switching, and public sharing.

No placeholder UI or speculative database columns should be added for these features until their requirements are approved.
