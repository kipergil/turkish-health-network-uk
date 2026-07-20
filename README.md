# Turkish Health Network UK

A directory of Turkish-speaking healthcare providers across the United
Kingdom — doctors, dentists, psychologists, physiotherapists, dietitians, clinics, hospitals and
pharmacies. Search by language, NHS/private status, speciality, insurance and location, or find
what's nearby on an interactive map.

Directory content is served from a [Directus](https://directus.io) backend (headless CMS + REST
API over PostgreSQL), and members can sign in with [Clerk](https://clerk.com) to save favorites,
leave reviews, and suggest new listings.

## Features

- **Directory sections** — Doctors, Dentists, Psychologists, Physiotherapists, Dietitians, NHS
  Doctors, Clinics, Hospitals, Pharmacies, Insurance
- **Interactive map** (MapLibre GL, no API key required) with category filtering, plus a List/Map
  toggle on every results page
- **Fuzzy search** (Fuse.js) across the whole network by name, speciality, city or language
- **Rich filters** — NHS/private status, spoken language, speciality, accepted insurance,
  Turkish-speaking only — collapsed behind a "Filters" toggle by default
- **Detailed profiles** — bio, qualifications & registration, opening hours, accessibility
  information, Google Maps links, accepted insurance, affiliated organizations/practitioners
- **Recommended in Turkey** — a separate, lighter-weight section for treatment-trip referrals,
  filterable by speciality and city
- **Member accounts (Clerk)** — sign in to save favorites, leave a moderated review, or suggest a
  listing that isn't in the directory yet
- **SEO** — per-page metadata, OpenGraph image generation, JSON-LD structured data
  (`schema.org` `Person`/`MedicalClinic`/`Hospital`/`Pharmacy`), sitemap, robots.txt
- **Accessibility** — WCAG AA-targeted: semantic landmarks, skip link, keyboard-navigable filters
  and map, verified with axe-core (0 violations across all page types at last check)
- **Mobile-first, responsive** UI built on shadcn/ui + Tailwind CSS v4

## Tech stack

| Layer          | Choice                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| Framework      | [Next.js 16](https://nextjs.org) (App Router, Turbopack, React Server Components)                        |
| Language       | TypeScript, `strict` mode, no `any`                                                                      |
| Styling        | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com)                                                     |
| Validation     | [Zod](https://zod.dev) — every record read from Directus is schema-validated                             |
| Backend/CMS    | [Directus](https://directus.io) (REST, via `@directus/sdk`) over PostgreSQL                              |
| Authentication | [Clerk](https://clerk.com) (`@clerk/nextjs`) — sign-in, sign-up, webhooks                                |
| Map            | [MapLibre GL](https://maplibre.org) with [OpenFreeMap](https://openfreemap.org) tiles (free, no API key) |
| Search         | [Fuse.js](https://fusejs.io) fuzzy search                                                                |
| Package mgr    | pnpm                                                                                                     |

## Getting started

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Set up environment variables** — copy `.env.example` to `.env.local` and fill in:
   - `DIRECTUS_URL` / `DIRECTUS_TOKEN` — a running Directus instance and a static admin/service
     token (used server-side only, for schema management, seeding, and all reads/writes).
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` — from a
     [Clerk application](https://dashboard.clerk.com).
   - `CLERK_WEBHOOK_SIGNING_SECRET` — from the Clerk Dashboard webhook pointed at
     `/api/webhooks/clerk` (subscribed to `user.created`/`user.updated`/`user.deleted`). Optional
     until you need member-account sync to work end-to-end.

3. **Create the Directus collections** (idempotent — safe to re-run):

   ```bash
   pnpm directus:apply-schema
   ```

4. **Seed the original UK provider/organization data** into Directus (idempotent — skips ids that
   already exist):

   ```bash
   pnpm directus:seed
   ```

5. **Run the app**

   ```bash
   pnpm dev       # http://localhost:3000
   ```

Other scripts:

```bash
pnpm build                    # production build
pnpm start                    # run the production build
pnpm lint                     # eslint
pnpm typecheck                # tsc --noEmit
pnpm format                   # prettier --write
pnpm directus:apply-schema    # create/verify Directus collections
pnpm directus:seed            # migrate data/*.json into Directus
```

## Architecture

The app follows a **clean, layered architecture** — UI code never talks to Directus directly:

```
Directus (collections)   →  the source of truth for directory content and member data
src/lib/directus/*        →  the Directus SDK client + the Schema type mapping collections → shapes
src/lib/schemas/*          →  Zod schemas — the single source of truth for shapes & validation
src/lib/data/*             →  repository layer: getAllX(), getXBySlug(), getXByCategory()...
src/lib/directory.ts       →  flattens providers + organizations into one search/map-friendly view
src/lib/filtering.ts       →  pure filter functions shared by every listing page
src/lib/actions/*          →  Server Actions for signed-in member writes (favorites, reviews, suggestions)
src/components/*           →  reusable, presentational UI (server components by default)
src/app/*                  →  routes: thin pages that call the data layer + render components
```

Every page and component imports data through `src/lib/data/*`, never by calling the Directus SDK
directly — that's what made the earlier JSON→Directus migration a data-layer-only change. Directus
collection field names are deliberately camelCase, matching the Zod schema keys 1:1
(`src/lib/directus/schema.ts`), so an item read from Directus validates against the _same_ schema
used everywhere else in the app with zero remapping.

Each repository function is wrapped in React's `cache()` to dedupe fetches within a single render
pass; cross-request freshness comes from Directus itself (it's a live backend now, not a
build-time snapshot), not from holding data in memory indefinitely.

### Domain model

Two entity families cover every directory section:

- **`Provider`** (`src/lib/schemas/provider.ts`) — an individual practitioner. The `category`
  field (`doctor` | `dentist` | `psychologist` | `physiotherapist` | `dietitian`) drives which
  section it appears under. **NHS Doctors** is not a separate category — it's `category: "doctor"`
  filtered by `nhsStatus !== "private"` (see `getNhsDoctors()`), avoiding duplicate practitioner
  records.
- **`Organization`** (`src/lib/schemas/organization.ts`) — a physical place. The `type` field
  (`clinic` | `hospital` | `pharmacy`) drives its section. Providers reference the organizations
  they practice at via `organizationIds`; the reverse lookup is computed at read time
  (`getProvidersByOrganization`), not stored, to avoid a bidirectional sync burden.

Supporting entities: `Speciality` (services/specialisms, scoped to provider categories),
`Insurance` (private insurers, cash plans, NHS), and `TurkeyReferral` (Turkey-based treatment-trip
recommendations — a separate, lighter schema since UK regulation/taxonomy doesn't apply there).
Shared value types — `Address`, `GeoPoint`, `OpeningHoursEntry`, `Accessibility`, `ContactInfo`,
spoken `LanguageCode` — live in `src/lib/schemas/common.ts`.

Member-feature entities (`src/lib/schemas/{app-user,favorite,review,listing-suggestion}.ts`):

- **`AppUser`** — a mirror of the signed-in Clerk user, kept in Directus so other collections can
  hold a normal foreign key. Synced by `/api/webhooks/clerk`.
- **`Favorite`** — a saved provider/organization for a signed-in member.
- **`Review`** — a rating + comment on a provider/organization. Starts `pending`; only `published`
  reviews are ever read back by the app — moderate them in the Directus Data Studio.
- **`ListingSuggestion`** — a signed-in member's suggestion for a listing not yet in the directory.
  An intake queue, not the canonical record — an admin turns approved suggestions into real
  Provider/Organization/TurkeyReferral rows in Directus.

`id`/`slug`/`verified`/`featured`/`createdAt`/`updatedAt` are shared across every directory entity
(`baseEntitySchema` in `src/lib/schemas/common.ts`).

### Managing content

Directory content (providers, organizations, specialities, insurances, Turkey referrals) is
managed directly in the **Directus Data Studio** (its built-in admin UI) — there is no separate
admin panel inside this Next.js app. Moderating reviews and listing suggestions (flipping
`status` to `published`/`approved`) happens there too.

To bootstrap or refresh the original researched UK dataset, edit the relevant file under `/data`
and re-run `pnpm directus:seed` — it's idempotent and only creates ids that don't already exist in
Directus, so hand edits made afterwards in the Data Studio are never overwritten.

If this app's Directus instance is shared with other projects, `pnpm directus:apply-schema` nests
every collection this app owns under a single **"health"** folder in the Data Studio sidebar
(a folder-only collection, no table) so it doesn't mix into a shared, flat collection list. Re-run
it any time to re-apply the grouping — it's a no-op if a collection is already grouped correctly.

## Authentication & member features

Sign-in is handled by Clerk (`@clerk/nextjs`) and gates three optional features — the directory
itself stays fully public:

- **Favorites** (`/favorites`) — save any provider/organization from its profile page; the button
  prompts sign-in if you're signed out.
- **Reviews** — leave a 1–5 star rating + comment on any profile; visible after moderation.
- **Suggest a listing** (`/suggest`) — a form for a doctor/clinic/Turkey referral not yet listed.

`src/proxy.ts` (Next.js 16 renamed the `middleware` file convention to `proxy` — see
`node_modules/next/dist/docs/.../file-conventions/proxy.md`) protects `/favorites` and `/suggest`
via `clerkMiddleware()` + `createRouteMatcher()`. Every Server Action in `src/lib/actions/` also
re-checks `auth()` itself, since profile-page writes (favoriting, reviewing) aren't behind a
protected route — only the dedicated pages are.

`/api/webhooks/clerk` keeps the Directus `app_users` collection in sync with Clerk
(`user.created`/`user.updated`/`user.deleted`), verified via `verifyWebhook` from
`@clerk/nextjs/webhooks`.

## Project structure

```
data/                        Original JSON seed content, migrated into Directus by
                              `pnpm directus:seed` (doctors, dentists, ..., insurances, specialities)
scripts/directus/             apply-schema.ts (creates collections), seed.ts (migrates data/*.json)
src/
  proxy.ts                    Clerk route protection (Next.js 16 "proxy" file convention)
  app/
    doctors/ dentists/ psychologists/ physiotherapists/ dietitians/   → list + [slug] profile
    nhs-doctors/ clinics/ hospitals/ pharmacies/                      → list (+ [slug] for orgs)
    insurance/ map/ search/ about/ turkey-doctors/
    favorites/ suggest/                                               → Clerk-protected member pages
    sign-in/[[...sign-in]]/ sign-up/[[...sign-up]]/                   → Clerk auth pages
    api/webhooks/clerk/                                                → Clerk → Directus user sync
    sitemap.ts robots.ts opengraph-image.tsx
  components/
    providers/ organizations/    entity cards, category/profile views
    filters/                     URL-driven directory filters + collapsible disclosure
    map/                         MapLibre map + category explorer
    search/                      Fuse.js search experience
    reviews/ suggestions/        review form/list, listing-suggestion form
    shared/                      badges, favorite button, results view (list/map toggle), empty state...
    seo/                         JSON-LD helper
    layout/                      header (+ user menu), footer
    ui/                          shadcn/ui primitives
  lib/
    directus/                    Directus SDK client + collection Schema type
    schemas/                     Zod schemas (source of truth for all types)
    data/                        repository layer (Directus-backed)
    actions/                     Server Actions for member writes
    constants/                   categories, languages, nav, site metadata
    seo/                         metadata + structured-data builders
    directory.ts filtering.ts geo.ts initials.ts
```

## Roadmap

- **Scoped Directus tokens** — the app currently uses one static admin token server-side (safe,
  since nothing runs client-side against Directus); splitting it into a read-only directory token
  and a write-only member-feature token is a reasonable hardening step before scaling.
- **On-demand revalidation** — a Directus flow/webhook calling a `revalidateTag`/`revalidatePath`
  route on content changes, instead of relying solely on request-time fetches.
- **AI-assisted search** — layer semantic search on top of (or instead of) the existing Fuse.js
  index in `src/components/search`.
- **Appointments** — booking flow against provider availability.
- **Multi-language UI** — content is already language-tagged (`LanguageCode`); the UI strings
  themselves are the remaining piece for full i18n.
- **Multi-community support** — the schema is not Turkish-specific (`languagesSpoken` is an open
  set); new communities are additional data, not a schema change.

## Contributing

Issues and pull requests are welcome — corrections to existing listings, new providers/clinics,
new specialities or insurers, or improvements to the app itself.

## License

[MIT](./LICENSE)
