import "server-only";
import { createDirectus, rest, staticToken } from "@directus/sdk";
import type { DirectusSchema } from "@/lib/directus/schema";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". See .env.example.`,
    );
  }
  return value;
}

/**
 * Single server-only Directus client for the whole app. Every collection
 * read/write — directory data and member features alike — goes through
 * this, authenticated with a static token. There is no client-side
 * Directus usage: all pages are server-rendered, so a scoped-down public
 * token isn't needed for this app to function, though swapping to one
 * (read-only on directory collections, write-only on the member-feature
 * ones) is a reasonable hardening step before scaling this beyond a
 * single trusted token.
 */
export const directus = createDirectus<DirectusSchema>(
  requireEnv("DIRECTUS_URL"),
)
  .with(rest())
  .with(staticToken(requireEnv("DIRECTUS_TOKEN")));
