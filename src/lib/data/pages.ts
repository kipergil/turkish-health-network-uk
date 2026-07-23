import "server-only";
import { cache } from "react";
import { readItems } from "@directus/sdk";
import { directus } from "@/lib/directus/client";
import { stripNulls } from "@/lib/directus/normalize";
import { pagesFileSchema, type Page } from "@/lib/schemas";

export const getAllPages = cache(async (): Promise<Page[]> => {
  const items = await directus.request(readItems("pages", { limit: -1 }));
  return pagesFileSchema.parse(stripNulls(items));
});

export async function getPublishedPages(): Promise<Page[]> {
  const pages = await getAllPages();
  return pages.filter((page) => page.status === "published");
}

export async function getPublishedPageBySlug(
  slug: string,
): Promise<Page | undefined> {
  const pages = await getPublishedPages();
  return pages.find((page) => page.slug === slug);
}
