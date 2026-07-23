/**
 * Idempotently creates every collection this app needs on a live Directus
 * instance, and keeps each field's admin-panel view mode (interface/choices)
 * in sync. Safe to re-run: creates what's missing, updates field `meta` on
 * what already exists, never touches `schema` (column type/nullability) or
 * data on existing fields.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/directus/apply-schema.ts
 */
import {
  createDirectus,
  createCollection,
  createField,
  readCollections,
  readFieldsByCollection,
  updateCollection,
  updateField,
  rest,
  staticToken,
} from "@directus/sdk";
import type { NestedPartial, DirectusField } from "@directus/sdk";

import {
  NHS_STATUSES,
  NHS_STATUS_LABELS,
  ORGANIZATION_TYPES,
  ORGANIZATION_TYPE_LABELS,
  PROVIDER_CATEGORIES,
  PROVIDER_CATEGORY_LABELS,
  REGISTRATION_BODIES,
} from "../../src/lib/constants/categories";
import { LANGUAGE_CODES, LANGUAGE_LABELS } from "../../src/lib/constants/languages";

/**
 * This Directus instance is shared with other apps (their collections are
 * grouped separately in the Data Studio nav). "health" is a folder-only
 * collection (no table — `schema: null`) that nests every collection below
 * under one entry in the sidebar so it doesn't mix into the shared list.
 */
const GROUP_NAME = "health";
const GROUP_NOTE =
  "Turkish Health Network UK — directory + member-feature collections";

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;

if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
  throw new Error(
    "DIRECTUS_URL and DIRECTUS_TOKEN must be set (see .env.example).",
  );
}

const directus = createDirectus(DIRECTUS_URL)
  .with(rest())
  .with(staticToken(DIRECTUS_TOKEN));

type FieldDef = NestedPartial<DirectusField>;
type Choice = { text: string; value: string | number };

function choicesFrom(
  values: readonly string[],
  labels: Record<string, string>,
): Choice[] {
  return values.map((value) => ({ text: labels[value] ?? value, value }));
}

function stringPk(note: string): FieldDef {
  return {
    field: "id",
    type: "string",
    meta: { interface: "input", note, readonly: false },
    schema: {
      is_primary_key: true,
      has_auto_increment: false,
      is_nullable: false,
    },
  };
}

function uuidPk(): FieldDef {
  return {
    field: "id",
    type: "uuid",
    meta: {
      special: ["uuid"],
      interface: "input",
      readonly: true,
      hidden: true,
    },
    schema: {
      is_primary_key: true,
      has_auto_increment: false,
      is_nullable: false,
    },
  };
}

interface FieldOpts {
  required?: boolean;
  note?: string;
  /** Explicit interface override. Defaults are inferred from `type` below. */
  interface?: string;
  /** Fixed choices — renders `select-dropdown` (single) or `select-multiple-dropdown` (json array). */
  choices?: Choice[];
  /** Free-form string array (no fixed choices) — renders `tags`. */
  tags?: boolean;
  /** Repeatable structured array (json array-of-objects) — renders `list` with sub-fields. */
  list?: { fields: Record<string, unknown>[]; template?: string };
}

function field(name: string, type: string, opts: FieldOpts = {}): FieldDef {
  let iface = opts.interface;
  const options: Record<string, unknown> = {};

  if (!iface) {
    if (opts.list) {
      iface = "list";
      options["fields"] = opts.list.fields;
      if (opts.list.template) options["template"] = opts.list.template;
    } else if (opts.choices) {
      iface = type === "json" ? "select-multiple-dropdown" : "select-dropdown";
      options["choices"] = opts.choices;
    } else if (opts.tags) {
      iface = "tags";
    } else if (type === "text") {
      iface = "input-multiline";
    } else if (type === "boolean") {
      iface = "boolean";
    } else if (type === "date" || type === "timestamp" || type === "dateTime") {
      iface = "datetime";
    } else if (type === "json") {
      iface = "input-code";
    } else {
      iface = "input";
    }
  }

  return {
    field: name,
    type,
    meta: {
      note: opts.note ?? null,
      required: opts.required ?? false,
      interface: iface,
      ...(Object.keys(options).length > 0 ? { options } : {}),
    },
    schema: { is_nullable: !opts.required },
  };
}

// --- Shared choice lists for admin-panel dropdowns -------------------------

const providerCategoryChoices = choicesFrom(
  PROVIDER_CATEGORIES,
  PROVIDER_CATEGORY_LABELS,
);
const organizationTypeChoices = choicesFrom(
  ORGANIZATION_TYPES,
  ORGANIZATION_TYPE_LABELS,
);
const nhsStatusChoices = choicesFrom(NHS_STATUSES, NHS_STATUS_LABELS);
const registrationBodyChoices = choicesFrom(REGISTRATION_BODIES, {});
const languageChoices = choicesFrom(LANGUAGE_CODES, LANGUAGE_LABELS);

// Small enums that only exist as inline z.enum(...) literals in the app's
// Zod schemas (src/lib/schemas/*) rather than exported constants — kept
// in sync by hand since there's nothing importable to derive them from.
const insuranceKindChoices: Choice[] = [
  { text: "Private Health Insurance", value: "private-health-insurance" },
  { text: "Cash Plan", value: "cash-plan" },
  { text: "NHS Scheme", value: "nhs-scheme" },
];
const turkeyReferralKindChoices: Choice[] = [
  { text: "Doctor", value: "doctor" },
  { text: "Dentist", value: "dentist" },
  { text: "Clinic", value: "clinic" },
];
const listingSuggestionKindChoices: Choice[] = [
  { text: "Provider", value: "provider" },
  { text: "Organization", value: "organization" },
  { text: "Turkey Referral", value: "turkey_referral" },
];
const listingSuggestionStatusChoices: Choice[] = [
  { text: "Pending", value: "pending" },
  { text: "Approved", value: "approved" },
  { text: "Rejected", value: "rejected" },
];
const reviewStatusChoices: Choice[] = [
  { text: "Pending", value: "pending" },
  { text: "Published", value: "published" },
  { text: "Rejected", value: "rejected" },
];
const subjectKindChoices: Choice[] = [
  { text: "Provider", value: "provider" },
  { text: "Organization", value: "organization" },
];
const pageStatusChoices: Choice[] = [
  { text: "Draft", value: "draft" },
  { text: "Published", value: "published" },
];
const ratingChoices: Choice[] = [1, 2, 3, 4, 5].map((n) => ({
  text: `${n} star${n === 1 ? "" : "s"}`,
  value: n,
}));
const weekdayChoices: Choice[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
].map((day) => ({ text: day[0]!.toUpperCase() + day.slice(1), value: day }));

const openingHoursListFields: Record<string, unknown>[] = [
  {
    field: "day",
    name: "Day",
    type: "string",
    meta: {
      interface: "select-dropdown",
      options: { choices: weekdayChoices },
      width: "half",
    },
  },
  {
    field: "opens",
    name: "Opens",
    type: "string",
    meta: {
      interface: "input",
      options: { placeholder: "HH:mm" },
      width: "half",
    },
  },
  {
    field: "closes",
    name: "Closes",
    type: "string",
    meta: {
      interface: "input",
      options: { placeholder: "HH:mm" },
      width: "half",
    },
  },
  {
    field: "closed",
    name: "Closed",
    type: "boolean",
    meta: { interface: "boolean", width: "half" },
  },
];

interface CollectionDef {
  collection: string;
  note: string;
  fields: FieldDef[];
}

const collections: CollectionDef[] = [
  {
    collection: "specialities",
    note: "A service/specialism a provider or organization offers (e.g. Cardiology).",
    fields: [
      stringPk("Human-readable id, e.g. spec-cardiology"),
      field("slug", "string", { required: true }),
      field("name", "string", { required: true }),
      field("description", "text", { required: true }),
      field("categories", "json", {
        required: true,
        note: "Provider category strings this speciality applies to.",
        choices: providerCategoryChoices,
      }),
    ],
  },
  {
    collection: "insurances",
    note: "An insurance/payment scheme accepted by providers and organizations.",
    fields: [
      stringPk("Human-readable id, e.g. ins-bupa"),
      field("slug", "string", { required: true }),
      field("name", "string", { required: true }),
      field("kind", "string", {
        required: true,
        choices: insuranceKindChoices,
      }),
      field("description", "text", { required: true }),
      field("website", "string"),
      field("logoUrl", "string"),
    ],
  },
  {
    collection: "organizations",
    note: "A physical place: clinic, hospital or pharmacy.",
    fields: [
      stringPk("Human-readable id, e.g. org-mediwell-clinic"),
      field("slug", "string", { required: true }),
      field("type", "string", {
        required: true,
        choices: organizationTypeChoices,
      }),
      field("name", "string", { required: true }),
      field("description", "text", { required: true }),
      field("address", "json", {
        required: true,
        note: "{ line1, line2?, city, postcode, region?, country }",
      }),
      field("geo", "json", { required: true, note: "{ lat, lng }" }),
      field("contact", "json", {
        required: true,
        note: "{ phone?, email?, website? }",
      }),
      field("openingHours", "json", {
        list: {
          fields: openingHoursListFields,
          template: "{{day}}: {{opens}} – {{closes}}",
        },
      }),
      field("nhsStatus", "string", {
        required: true,
        choices: nhsStatusChoices,
      }),
      field("languagesSpoken", "json", {
        required: true,
        choices: languageChoices,
      }),
      field("turkishSpeakingStaff", "boolean"),
      field("insuranceIds", "json"),
      field("specialityIds", "json"),
      field("accessibility", "json"),
      field("images", "json", { tags: true }),
      field("googleMapsUrl", "string"),
      field("verified", "boolean"),
      field("featured", "boolean"),
      field("createdAt", "date", { required: true }),
      field("updatedAt", "date", { required: true }),
    ],
  },
  {
    collection: "providers",
    note: "An individual practitioner: doctor, dentist, psychologist, physiotherapist or dietitian.",
    fields: [
      stringPk("Human-readable id, e.g. prv-zehra-kocer"),
      field("slug", "string", { required: true }),
      field("category", "string", {
        required: true,
        choices: providerCategoryChoices,
      }),
      field("name", "string", { required: true }),
      field("title", "string", { required: true }),
      field("photoUrl", "string"),
      field("bio", "text", { required: true }),
      field("qualifications", "json", { tags: true }),
      field("registrationBody", "string", { choices: registrationBodyChoices }),
      field("registrationNumber", "string"),
      field("yearsOfExperience", "integer"),
      field("specialityIds", "json"),
      field("languagesSpoken", "json", {
        required: true,
        choices: languageChoices,
      }),
      field("turkishSpeaking", "boolean"),
      field("nhsStatus", "string", {
        required: true,
        choices: nhsStatusChoices,
      }),
      field("organizationIds", "json"),
      field("insuranceIds", "json"),
      field("accessibility", "json"),
      field("openingHours", "json", {
        list: {
          fields: openingHoursListFields,
          template: "{{day}}: {{opens}} – {{closes}}",
        },
      }),
      field("contact", "json"),
      field("googleMapsUrl", "string"),
      field("verified", "boolean"),
      field("featured", "boolean"),
      field("createdAt", "date", { required: true }),
      field("updatedAt", "date", { required: true }),
    ],
  },
  {
    collection: "turkey_referrals",
    note: "A doctor, dentist or clinic in Turkey recommended for treatment trips. Not part of the UK network.",
    fields: [
      stringPk("Human-readable id, e.g. tr-mehmet-ada"),
      field("slug", "string", { required: true }),
      field("kind", "string", {
        required: true,
        choices: turkeyReferralKindChoices,
      }),
      field("name", "string", { required: true }),
      field("title", "string"),
      field("specialityText", "string", { required: true }),
      field("city", "string", { required: true }),
      field("affiliation", "string"),
      field("phone", "string"),
      field("website", "string"),
      field("notes", "text"),
      field("verified", "boolean"),
    ],
  },
  {
    collection: "app_users",
    note: "Mirror of Clerk users, synced by /api/webhooks/clerk. Referenced by favorites/reviews/listing_suggestions.",
    fields: [
      stringPk("Clerk user id, e.g. user_..."),
      field("email", "string", { required: true }),
      field("firstName", "string"),
      field("lastName", "string"),
      field("imageUrl", "string"),
      field("createdAt", "timestamp", { required: true }),
      field("updatedAt", "timestamp", { required: true }),
    ],
  },
  {
    collection: "favorites",
    note: "A signed-in member's saved provider/organization.",
    fields: [
      uuidPk(),
      field("userId", "string", { required: true }),
      field("subjectKind", "string", {
        required: true,
        choices: subjectKindChoices,
      }),
      field("subjectId", "string", { required: true }),
      field("createdAt", "timestamp", { required: true }),
    ],
  },
  {
    collection: "reviews",
    note: "A signed-in member's review of a provider/organization. Starts pending; only published reviews are shown.",
    fields: [
      uuidPk(),
      field("subjectKind", "string", {
        required: true,
        choices: subjectKindChoices,
      }),
      field("subjectId", "string", { required: true }),
      field("rating", "integer", { required: true, choices: ratingChoices }),
      field("comment", "text"),
      field("authorUserId", "string", { required: true }),
      field("status", "string", {
        required: true,
        choices: reviewStatusChoices,
      }),
      field("createdAt", "timestamp", { required: true }),
    ],
  },
  {
    collection: "pages",
    note: "A simple CMS static page (title + rich-text body), e.g. informational guides. Only 'published' pages are shown; managed entirely in this admin.",
    fields: [
      stringPk("Human-readable id, e.g. page-nhs-benefits-guide"),
      field("slug", "string", { required: true }),
      field("title", "string", { required: true }),
      field("body", "text", {
        required: true,
        interface: "input-rich-text-html",
        note: "Rich-text page content, rendered as HTML on the site.",
      }),
      field("status", "string", {
        required: true,
        choices: pageStatusChoices,
      }),
      field("createdAt", "timestamp", { required: true }),
      field("updatedAt", "timestamp", { required: true }),
    ],
  },
  {
    collection: "listing_suggestions",
    note: "A signed-in member's suggestion for a listing not yet in the directory. Intake queue, reviewed by an admin.",
    fields: [
      uuidPk(),
      field("kind", "string", {
        required: true,
        choices: listingSuggestionKindChoices,
      }),
      field("name", "string", { required: true }),
      field("categoryText", "string"),
      field("city", "string"),
      field("phone", "string"),
      field("website", "string"),
      field("notes", "text"),
      field("status", "string", {
        required: true,
        choices: listingSuggestionStatusChoices,
      }),
      field("submittedByUserId", "string", { required: true }),
      field("createdAt", "timestamp", { required: true }),
    ],
  },
];

async function syncFields(collection: string, fields: FieldDef[]) {
  const existing = await directus.request(readFieldsByCollection(collection));
  const existingNames = new Set(existing.map((f) => f.field));

  for (const def of fields) {
    if (existingNames.has(def.field!)) {
      await directus.request(
        updateField(collection, def.field!, { meta: def.meta }),
      );
      console.log(`  ~ ${collection}.${def.field} (interface synced)`);
    } else {
      await directus.request(createField(collection, def));
      console.log(`  + ${collection}.${def.field} (created)`);
    }
  }
}

async function main() {
  const existing = await directus.request(readCollections());
  const existingNames = new Set(existing.map((c) => c.collection));

  if (!existingNames.has(GROUP_NAME)) {
    await directus.request(
      createCollection({
        collection: GROUP_NAME,
        meta: { note: GROUP_NOTE, icon: "medical_services" },
        schema: null,
      }),
    );
    console.log(`+ created "${GROUP_NAME}" collection group`);
  } else {
    console.log(`= "${GROUP_NAME}" collection group already exists`);
  }

  for (const def of collections) {
    if (existingNames.has(def.collection)) {
      await directus.request(
        updateCollection(def.collection, { meta: { group: GROUP_NAME } }),
      );
      console.log(`= ${def.collection} already exists, syncing fields...`);
      await syncFields(def.collection, def.fields);
      continue;
    }

    await directus.request(
      createCollection({
        collection: def.collection,
        meta: { note: def.note, group: GROUP_NAME },
        schema: { name: def.collection, comment: def.note },
        fields: def.fields,
      }),
    );
    console.log(`+ created ${def.collection} (grouped under "${GROUP_NAME}")`);
  }

  console.log("Schema apply complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
