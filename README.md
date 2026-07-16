# Turkish Health Network UK

A directory of Turkish, Kurdish and Cypriot-speaking healthcare providers across the United
Kingdom — doctors, dentists, psychologists, physiotherapists, dietitians, clinics, hospitals and
pharmacies. Search by language, NHS/private status, speciality, insurance and location, or find
what's nearby on an interactive map.

This is a production-grade, open-source starting point for a real community platform, built
**JSON-first** with a clean upgrade path to a real database — no backend required to run it today.

## Features

- **Directory sections** — Doctors, Dentists, Psychologists, Physiotherapists, Dietitians, NHS
  Doctors, Clinics, Hospitals, Pharmacies, Insurance
- **Interactive map** (MapLibre GL, no API key required) with category filtering
- **Fuzzy search** (Fuse.js) across the whole network by name, speciality, city or language
- **Rich filters** — NHS/private status, spoken language, speciality, accepted insurance,
  Turkish-speaking only
- **Detailed profiles** — bio, qualifications & registration, opening hours, accessibility
  information, Google Maps links, accepted insurance, affiliated organizations/practitioners
- **SEO** — per-page metadata, OpenGraph image generation, JSON-LD structured data
  (`schema.org` `Person`/`MedicalClinic`/`Hospital`/`Pharmacy`), sitemap, robots.txt
- **Accessibility** — WCAG AA-targeted: semantic landmarks, skip link, keyboard-navigable filters
  and map, verified with axe-core (0 violations across all page types at last check)
- **Mobile-first, responsive** UI built on shadcn/ui + Tailwind CSS v4

## Tech stack

| Layer       | Choice                                                     |
| ----------- | ----------------------------------------------------------- |
| Framework   | [Next.js 16](https://nextjs.org) (App Router, Turbopack, React Server Components) |
| Language    | TypeScript, `strict` mode, no `any`                        |
| Styling     | Tailwind CSS v4 + [shadcn/ui](https://ui.shadcn.com)        |
| Validation  | [Zod](https://zod.dev) — every JSON record is schema-validated at load time |
| Map         | [MapLibre GL](https://maplibre.org) with [OpenFreeMap](https://openfreemap.org) tiles (free, no API key) |
| Search      | [Fuse.js](https://fusejs.io) fuzzy search |
| Data        | Static JSON files under `/data`, no database                |
| Package mgr | pnpm                                                        |

## Getting started

```bash
pnpm install
pnpm dev       # http://localhost:3000
```

Other scripts:

```bash
pnpm build         # production build
pnpm start         # run the production build
pnpm lint          # eslint
pnpm typecheck     # tsc --noEmit
pnpm format        # prettier --write
```

## Architecture

The app follows a **clean, layered architecture** so the data source can change (JSON today,
PostgreSQL/Prisma tomorrow) without touching UI code:

```
data/*.json              →  raw content, hand-maintained today, DB rows tomorrow
src/lib/schemas/*         →  Zod schemas — the single source of truth for shapes & validation
src/lib/data/*            →  repository layer: getAllX(), getXBySlug(), getXByCategory()...
src/lib/directory.ts      →  flattens providers + organizations into one search/map-friendly view
src/lib/filtering.ts      →  pure filter functions shared by every listing page
src/components/*          →  reusable, presentational UI (server components by default)
src/app/*                 →  routes: thin pages that call the data layer + render components
```

**Why this matters for the roadmap:** every page and component imports data through
`src/lib/data/*`, never by reading JSON files directly. To move to PostgreSQL + Prisma, only the
functions in `src/lib/data/*.ts` need to change (e.g. `Array.filter` → `prisma.provider.findMany`);
every route, component and Zod type stays the same. Referential integrity between records
(a provider's `organizationIds`, `specialityIds`, `insuranceIds`) is asserted at module-load time
today (`src/lib/data/integrity.ts`) as a stand-in for the foreign-key constraints a real database
would enforce.

### Domain model

Two entity families cover every section in the nav:

- **`Provider`** (`src/lib/schemas/provider.ts`) — an individual practitioner. The `category`
  field (`doctor` | `dentist` | `psychologist` | `physiotherapist` | `dietitian`) drives which
  section it appears under. **NHS Doctors** is not a separate category — it's `category: "doctor"`
  filtered by `nhsStatus !== "private"` (see `getNhsDoctors()`), avoiding duplicate practitioner
  records.
- **`Organization`** (`src/lib/schemas/organization.ts`) — a physical place. The `type` field
  (`clinic` | `hospital` | `pharmacy`) drives its section. Providers reference the organizations
  they practice at via `organizationIds`; the reverse lookup is computed at read time
  (`getProvidersByOrganization`), not stored, to avoid a bidirectional sync burden.

Supporting entities: `Speciality` (services/specialisms, scoped to provider categories) and
`Insurance` (private insurers, cash plans, NHS). Shared value types — `Address`, `GeoPoint`,
`OpeningHoursEntry`, `Accessibility`, `ContactInfo`, spoken `LanguageCode` — live in
`src/lib/schemas/common.ts`.

Every entity extends a `baseEntitySchema` (`id`, `slug`, `verified`, `featured`, `createdAt`,
`updatedAt`) mirroring the columns a Prisma model would carry, so the eventual migration doesn't
need to invent new fields.

### Adding or editing data

1. Edit the relevant file under `/data` (e.g. `data/doctors.json`).
2. Run `pnpm dev` or `pnpm build` — every record is parsed through its Zod schema
   (`src/lib/schemas/*`) at load time, and cross-references (`specialityIds`, `insuranceIds`,
   `organizationIds`) are checked against the other files. Typos or missing fields fail fast with
   a clear error instead of silently rendering broken pages.
3. Slugs must be lowercase and hyphen-separated — they become the URL (`/doctors/dr-mehmet-yilmaz`).

## Project structure

```
data/                      JSON content (doctors, dentists, psychologists, physiotherapists,
                           dietitians, clinics, hospitals, pharmacies, insurances, specialities)
src/
  app/                     Next.js routes (App Router)
    doctors/ dentists/ psychologists/ physiotherapists/ dietitians/   → list + [slug] profile
    nhs-doctors/ clinics/ hospitals/ pharmacies/                      → list (+ [slug] for orgs)
    insurance/ map/ search/ about/
    sitemap.ts robots.ts opengraph-image.tsx
  components/
    providers/ organizations/    entity cards, category/profile views
    filters/                     URL-driven directory filters (client component)
    map/                         MapLibre map + category explorer
    search/                      Fuse.js search experience
    shared/                      badges, opening hours table, breadcrumbs, empty state...
    seo/                         JSON-LD helper
    layout/                      header, footer
    ui/                          shadcn/ui primitives
  lib/
    schemas/                     Zod schemas (source of truth for all types)
    data/                        repository layer (JSON today, DB-ready)
    constants/                   categories, languages, nav, site metadata
    seo/                         metadata + structured-data builders
    directory.ts filtering.ts geo.ts initials.ts
```

## Roadmap

The architecture is deliberately prepared for these next steps:

- **PostgreSQL + Prisma** — swap the implementations in `src/lib/data/*.ts`; schemas and routes
  are unaffected.
- **Admin panel** — CRUD UI over the same Zod schemas, writing to the database instead of JSON.
- **Authentication** — for admins and, later, verified providers managing their own listing.
- **Reviews** — a new `Review` entity referencing a `Provider`/`Organization` by id, same pattern
  as `Speciality`/`Insurance`.
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
