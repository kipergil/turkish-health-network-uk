/**
 * Idempotently creates every collection this app needs on a live Directus
 * instance. Safe to re-run: existing collections are left untouched.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/directus/apply-schema.ts
 */
import {
  createDirectus,
  createCollection,
  readCollections,
  rest,
  staticToken,
} from "@directus/sdk";
import type { NestedPartial, DirectusField } from "@directus/sdk";

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

function field(
  name: string,
  type: string,
  opts: { required?: boolean; note?: string; interface?: string } = {},
): FieldDef {
  return {
    field: name,
    type,
    meta: {
      note: opts.note ?? null,
      required: opts.required ?? false,
      interface:
        opts.interface ??
        (type === "text"
          ? "input-multiline"
          : type === "boolean"
            ? "boolean"
            : type === "json"
              ? "input-code"
              : "input"),
    },
    schema: { is_nullable: !opts.required },
  };
}

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
        note: "Array of provider category strings this speciality applies to.",
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
      field("kind", "string", { required: true }),
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
      field("type", "string", { required: true }),
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
      field("openingHours", "json"),
      field("nhsStatus", "string", { required: true }),
      field("languagesSpoken", "json", { required: true }),
      field("turkishSpeakingStaff", "boolean"),
      field("insuranceIds", "json"),
      field("specialityIds", "json"),
      field("accessibility", "json"),
      field("images", "json"),
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
      field("category", "string", { required: true }),
      field("name", "string", { required: true }),
      field("title", "string", { required: true }),
      field("photoUrl", "string"),
      field("bio", "text", { required: true }),
      field("qualifications", "json"),
      field("registrationBody", "string"),
      field("registrationNumber", "string"),
      field("yearsOfExperience", "integer"),
      field("specialityIds", "json"),
      field("languagesSpoken", "json", { required: true }),
      field("turkishSpeaking", "boolean"),
      field("nhsStatus", "string", { required: true }),
      field("organizationIds", "json"),
      field("insuranceIds", "json"),
      field("accessibility", "json"),
      field("openingHours", "json"),
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
      field("kind", "string", { required: true }),
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
      field("subjectKind", "string", { required: true }),
      field("subjectId", "string", { required: true }),
      field("createdAt", "timestamp", { required: true }),
    ],
  },
  {
    collection: "reviews",
    note: "A signed-in member's review of a provider/organization. Starts pending; only published reviews are shown.",
    fields: [
      uuidPk(),
      field("subjectKind", "string", { required: true }),
      field("subjectId", "string", { required: true }),
      field("rating", "integer", { required: true }),
      field("comment", "text"),
      field("authorUserId", "string", { required: true }),
      field("status", "string", { required: true }),
      field("createdAt", "timestamp", { required: true }),
    ],
  },
  {
    collection: "listing_suggestions",
    note: "A signed-in member's suggestion for a listing not yet in the directory. Intake queue, reviewed by an admin.",
    fields: [
      uuidPk(),
      field("kind", "string", { required: true }),
      field("name", "string", { required: true }),
      field("categoryText", "string"),
      field("city", "string"),
      field("phone", "string"),
      field("website", "string"),
      field("notes", "text"),
      field("status", "string", { required: true }),
      field("submittedByUserId", "string", { required: true }),
      field("createdAt", "timestamp", { required: true }),
    ],
  },
];

async function main() {
  const existing = await directus.request(readCollections());
  const existingNames = new Set(existing.map((c) => c.collection));

  for (const def of collections) {
    if (existingNames.has(def.collection)) {
      console.log(`= ${def.collection} already exists, skipping`);
      continue;
    }

    await directus.request(
      createCollection({
        collection: def.collection,
        meta: { note: def.note },
        schema: { name: def.collection, comment: def.note },
        fields: def.fields,
      }),
    );
    console.log(`+ created ${def.collection}`);
  }

  console.log("Schema apply complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
