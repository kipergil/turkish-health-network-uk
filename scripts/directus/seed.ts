/**
 * Migrates the original data/*.json seed data into Directus collections
 * (created by apply-schema.ts). Safe to re-run: any id that already exists
 * in the target collection is skipped.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/directus/seed.ts
 */
import {
  createDirectus,
  createItems,
  readItems,
  rest,
  staticToken,
} from "@directus/sdk";

import clinicsJson from "../../data/clinics.json" with { type: "json" };
import hospitalsJson from "../../data/hospitals.json" with { type: "json" };
import pharmaciesJson from "../../data/pharmacies.json" with { type: "json" };
import doctorsJson from "../../data/doctors.json" with { type: "json" };
import dentistsJson from "../../data/dentists.json" with { type: "json" };
import psychologistsJson from "../../data/psychologists.json" with { type: "json" };
import physiotherapistsJson from "../../data/physiotherapists.json" with { type: "json" };
import dietitiansJson from "../../data/dietitians.json" with { type: "json" };
import specialitiesJson from "../../data/specialities.json" with { type: "json" };
import insurancesJson from "../../data/insurances.json" with { type: "json" };
import turkeyReferralsJson from "../../data/turkey-referrals.json" with { type: "json" };

import {
  organizationsFileSchema,
  providersFileSchema,
  specialitiesFileSchema,
  insurancesFileSchema,
  turkeyReferralsFileSchema,
} from "@/lib/schemas";

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

async function seedCollection<T extends { id: string }>(
  collection: string,
  items: T[],
) {
  if (items.length === 0) return;

  const existing = (await directus.request(
    readItems(collection as never, { fields: ["id"], limit: -1 } as never),
  )) as { id: string }[];
  const existingIds = new Set(existing.map((item) => item.id));

  const toCreate = items.filter((item) => !existingIds.has(item.id));
  if (toCreate.length === 0) {
    console.log(`= ${collection}: all ${items.length} item(s) already seeded`);
    return;
  }

  await directus.request(createItems(collection as never, toCreate as never));
  console.log(
    `+ ${collection}: created ${toCreate.length} item(s), skipped ${
      items.length - toCreate.length
    } already-seeded`,
  );
}

async function main() {
  const specialities = specialitiesFileSchema.parse(specialitiesJson);
  const insurances = insurancesFileSchema.parse(insurancesJson);
  const organizations = organizationsFileSchema.parse([
    ...clinicsJson,
    ...hospitalsJson,
    ...pharmaciesJson,
  ]);
  const providers = providersFileSchema.parse([
    ...doctorsJson,
    ...dentistsJson,
    ...psychologistsJson,
    ...physiotherapistsJson,
    ...dietitiansJson,
  ]);
  const turkeyReferrals = turkeyReferralsFileSchema.parse(turkeyReferralsJson);

  // Specialities/insurances first: organizations and providers reference
  // them by id (informally — see the schema comment on why these are
  // plain JSON arrays rather than Directus relations).
  await seedCollection("specialities", specialities);
  await seedCollection("insurances", insurances);
  await seedCollection("organizations", organizations);
  await seedCollection("providers", providers);
  await seedCollection("turkey_referrals", turkeyReferrals);

  console.log("Seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
