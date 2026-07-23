/**
 * Idempotently seeds the "pages" collection (created by apply-schema.ts)
 * with its starting CMS content. Safe to re-run: skips any id that already
 * exists, so edits made afterwards in the Directus Data Studio are never
 * overwritten.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/directus/seed-pages.ts
 */
import { createDirectus, createItem, readItems, rest, staticToken } from "@directus/sdk";

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

const NHS_BENEFITS_GUIDE_BODY = `
<p>The NHS (National Health Service) provides most healthcare in the UK free at the point of use, funded through general taxation and National Insurance. This guide covers the practical steps to start using it, and how it fits alongside private health insurance.</p>

<h2>1. Register with a GP surgery</h2>
<p>A GP (General Practitioner) surgery is almost always the first point of contact for non-emergency healthcare, and registering with one is the single most important step. You can register with any surgery whose catchment area covers where you live, regardless of your immigration status — registration itself is free and does not require proof of address, ID or immigration documents, although some surgeries may ask for these as a courtesy. Search "GP surgery near me" on <a href="https://www.nhs.uk/service-search/find-a-gp" target="_blank" rel="noopener noreferrer">nhs.uk</a>, or use this directory's <a href="/map">map</a> to find Turkish-speaking practices.</p>
<p>Once registered, you'll usually be issued an NHS number, which is used across the whole health service to link your records.</p>

<h2>2. Who is eligible for free NHS care</h2>
<p>GP consultations are free for everyone living in the UK. Hospital treatment is generally free for anyone "ordinarily resident" in the UK; some visa categories (including most work and family visas) include an Immigration Health Surcharge paid as part of the visa application, which then entitles the holder to NHS care on broadly the same basis as a resident. Short-term visitors and some other categories may be charged for certain hospital services. Since eligibility rules change and depend on individual circumstances, check current guidance on <a href="https://www.gov.uk/guidance/healthcare-for-visitors-and-migrants-to-england" target="_blank" rel="noopener noreferrer">gov.uk</a> or ask your GP surgery's reception directly if unsure.</p>

<h2>3. Prescriptions, dental and eyecare</h2>
<p>Prescriptions issued in England carry a standard charge per item, with common exemptions for children, people over 60, pregnant or recently pregnant women, and people with certain long-term conditions or on low incomes — prescriptions are free in Scotland, Wales and Northern Ireland regardless of these categories. NHS dental treatment is charged in banded rates (a fixed fee per band of treatment, not per procedure), and NHS eye tests are free for the same groups exempt from prescription charges. Exact current charges and exemption criteria are listed on <a href="https://www.nhs.uk/nhs-services/help-with-health-costs/" target="_blank" rel="noopener noreferrer">nhs.uk</a>.</p>

<h2>4. Choosing the right service</h2>
<ul>
<li><strong>GP surgery</strong> — routine and ongoing health concerns, referrals to specialists, repeat prescriptions.</li>
<li><strong>NHS 111</strong> (phone or online) — urgent but not life-threatening concerns, when your GP is closed, or if you're not sure where to go.</li>
<li><strong>A&E or 999</strong> — emergencies only: chest pain, severe bleeding, difficulty breathing, loss of consciousness.</li>
<li><strong>Pharmacy</strong> — minor ailments, advice, and an increasing range of services (some pharmacies can now treat certain conditions directly without a GP appointment).</li>
</ul>

<h2>5. Private health insurance alongside the NHS</h2>
<p>Private health insurance in the UK is not a replacement for the NHS — it's used alongside it, typically to access faster specialist appointments and elective (non-emergency) procedures, private hospital rooms, or treatments not routinely funded by the NHS. Emergency care always goes through the NHS regardless of any private cover. Many employers offer private health insurance as a benefit; individual policies are also widely available. This directory lists which <a href="/insurance">insurers and cash plans</a> local providers accept, so you can check compatibility before booking.</p>

<h2>6. Language support</h2>
<p>You are entitled to ask for an interpreter at NHS appointments, including GP surgeries and hospitals, free of charge — you don't need to bring your own, though many people prefer to see a Turkish-speaking provider directly where possible. This directory exists to make that easier: every listing records the languages a provider speaks.</p>

<h2>Where to get help</h2>
<p>For anything specific to your situation, the most reliable sources are <a href="https://www.nhs.uk" target="_blank" rel="noopener noreferrer">nhs.uk</a>, <a href="https://www.gov.uk/browse/healthcare" target="_blank" rel="noopener noreferrer">gov.uk</a>, and your own GP surgery. This page is a general starting point, not a substitute for official guidance, and rules can change — always confirm anything important directly with the NHS or gov.uk before relying on it.</p>
`.trim();

interface PageDef {
  id: string;
  slug: string;
  title: string;
  body: string;
  status: "draft" | "published";
}

const pages: PageDef[] = [
  {
    id: "page-nhs-benefits-guide",
    slug: "nhs-insurance-benefits-uk",
    title: "How to Benefit from NHS Insurance & Health Services in the UK",
    body: NHS_BENEFITS_GUIDE_BODY,
    status: "published",
  },
];

async function main() {
  const existing = await directus.request(
    readItems("pages", { limit: -1, fields: ["id"] }),
  );
  const existingIds = new Set(existing.map((p) => p.id));

  for (const page of pages) {
    if (existingIds.has(page.id)) {
      console.log(`= ${page.id} already exists, skipping`);
      continue;
    }

    const now = new Date().toISOString();
    await directus.request(
      createItem("pages", {
        id: page.id,
        slug: page.slug,
        title: page.title,
        body: page.body,
        status: page.status,
        createdAt: now,
        updatedAt: now,
      }),
    );
    console.log(`+ created ${page.id}`);
  }

  console.log("Page seed complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
