/**
 * Idempotently creates the admin-notification email Flows this app needs on
 * a live Directus instance. Safe to re-run: skips any flow whose name
 * already exists.
 *
 * Requires the instance's email transport to be configured (EMAIL_TRANSPORT=
 * smtp and the EMAIL_SMTP_* env vars) for the "Send Email" operations to
 * actually deliver — that's an instance-level setting, not something a Flow
 * can configure itself.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/directus/apply-flows.ts
 */
import {
  createDirectus,
  createFlow,
  createOperation,
  readFlows,
  rest,
  staticToken,
  updateFlow,
} from "@directus/sdk";

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? "kipergil@gmail.com";

if (!DIRECTUS_URL || !DIRECTUS_TOKEN) {
  throw new Error(
    "DIRECTUS_URL and DIRECTUS_TOKEN must be set (see .env.example).",
  );
}

const directus = createDirectus(DIRECTUS_URL)
  .with(rest())
  .with(staticToken(DIRECTUS_TOKEN));

interface FlowDef {
  name: string;
  description: string;
  icon: string;
  collection: string;
  subject: string;
  body: string;
}

const adminUrl = (collection: string) =>
  `${DIRECTUS_URL!.replace(/\/$/, "")}/admin/content/${collection}/{{$trigger.key}}`;

const flows: FlowDef[] = [
  {
    name: "Notify admin — new listing suggestion",
    description:
      "Emails the admin when a member submits a new listing suggestion (Suggest a listing).",
    icon: "mail",
    collection: "listing_suggestions",
    subject: "New listing suggestion: {{$trigger.payload.name}}",
    body: `
      <p>A new listing suggestion was submitted on Turkish Health Network UK.</p>
      <ul>
        <li><strong>Kind:</strong> {{$trigger.payload.kind}}</li>
        <li><strong>Name:</strong> {{$trigger.payload.name}}</li>
        <li><strong>Category:</strong> {{$trigger.payload.categoryText}}</li>
        <li><strong>City:</strong> {{$trigger.payload.city}}</li>
        <li><strong>Phone:</strong> {{$trigger.payload.phone}}</li>
        <li><strong>Website:</strong> {{$trigger.payload.website}}</li>
        <li><strong>Notes:</strong> {{$trigger.payload.notes}}</li>
        <li><strong>Submitted by user:</strong> {{$trigger.payload.submittedByUserId}}</li>
      </ul>
      <p><a href="${adminUrl("listing_suggestions")}">Review in Directus</a></p>
    `.trim(),
  },
  {
    name: "Notify admin — new review",
    description:
      "Emails the admin when a member submits a new review, so it can be moderated before it goes live.",
    icon: "mail",
    collection: "reviews",
    subject: "New review submitted ({{$trigger.payload.subjectKind}})",
    body: `
      <p>A new review was submitted on Turkish Health Network UK and is pending moderation.</p>
      <ul>
        <li><strong>Subject kind:</strong> {{$trigger.payload.subjectKind}}</li>
        <li><strong>Subject id:</strong> {{$trigger.payload.subjectId}}</li>
        <li><strong>Rating:</strong> {{$trigger.payload.rating}} / 5</li>
        <li><strong>Comment:</strong> {{$trigger.payload.comment}}</li>
        <li><strong>Author user:</strong> {{$trigger.payload.authorUserId}}</li>
      </ul>
      <p><a href="${adminUrl("reviews")}">Review in Directus</a></p>
    `.trim(),
  },
];

async function main() {
  const existing = await directus.request(readFlows());
  const existingNames = new Set(existing.map((f) => f.name));

  for (const def of flows) {
    if (existingNames.has(def.name)) {
      console.log(`= "${def.name}" already exists, skipping`);
      continue;
    }

    const flow = await directus.request(
      createFlow({
        name: def.name,
        icon: def.icon,
        description: def.description,
        status: "active",
        trigger: "event",
        accountability: "all",
        options: {
          type: "action",
          scope: ["items.create"],
          collections: [def.collection],
        },
      }),
    );

    const operation = await directus.request(
      createOperation({
        name: "Send email to admin",
        key: "send_admin_email",
        type: "mail",
        position_x: 19,
        position_y: 1,
        flow: flow.id,
        options: {
          to: [ADMIN_EMAIL],
          subject: def.subject,
          type: "wysiwyg",
          body: def.body,
        },
      }),
    );

    await directus.request(
      updateFlow(flow.id, { operation: operation.id }),
    );

    console.log(`+ created "${def.name}" (trigger: ${def.collection}.items.create)`);
  }

  console.log("Flow apply complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
