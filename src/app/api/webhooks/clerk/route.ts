import type { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { UserJSON } from "@clerk/nextjs/server";
import { createItem, deleteItem, readItem, updateItem } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { appUserSchema } from "@/lib/schemas";

function primaryEmail(data: UserJSON): string {
  const primary = data.email_addresses.find(
    (email) => email.id === data.primary_email_address_id,
  );
  return primary?.email_address ?? data.email_addresses[0]?.email_address ?? "";
}

async function upsertAppUser(data: UserJSON) {
  const now = new Date().toISOString();
  const payload = appUserSchema.parse({
    id: data.id,
    email: primaryEmail(data),
    firstName: data.first_name ?? undefined,
    lastName: data.last_name ?? undefined,
    imageUrl: data.image_url ?? undefined,
    createdAt: now,
    updatedAt: now,
  });

  const exists = await directus
    .request(readItem("app_users", data.id))
    .then(() => true)
    .catch(() => false);

  if (exists) {
    await directus.request(
      updateItem("app_users", data.id, {
        email: payload.email,
        firstName: payload.firstName,
        lastName: payload.lastName,
        imageUrl: payload.imageUrl,
        updatedAt: now,
      }),
    );
  } else {
    await directus.request(createItem("app_users", payload));
  }
}

/**
 * Keeps the Directus `app_users` mirror in sync with Clerk so
 * favorites/reviews/listing_suggestions can hold a normal foreign key
 * instead of calling out to Clerk on every read.
 *
 * Configure this URL as a webhook endpoint in the Clerk Dashboard,
 * subscribed to user.created / user.updated / user.deleted, and set
 * CLERK_WEBHOOK_SIGNING_SECRET (or CLERK_WEBHOOK_SECRET) from its
 * "Signing Secret" in .env.local.
 */
export async function POST(request: NextRequest) {
  const signingSecret =
    process.env.CLERK_WEBHOOK_SIGNING_SECRET ??
    process.env.CLERK_WEBHOOK_SECRET;

  let event;
  try {
    event = await verifyWebhook(
      request,
      signingSecret ? { signingSecret } : undefined,
    );
  } catch (error) {
    console.error("Clerk webhook verification failed", error);
    return new Response("Webhook verification failed", { status: 400 });
  }

  try {
    switch (event.type) {
      case "user.created":
      case "user.updated":
        await upsertAppUser(event.data);
        break;
      case "user.deleted":
        if (event.data.id) {
          await directus
            .request(deleteItem("app_users", event.data.id))
            .catch(() => {
              // Already gone (or never synced) — nothing to clean up.
            });
        }
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(
      `Failed to sync Clerk event "${event.type}" into Directus`,
      error,
    );
    return new Response("Failed to process webhook", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
