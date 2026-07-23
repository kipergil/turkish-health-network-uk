import { z } from "zod";
import { slugSchema } from "@/lib/schemas/common";

/**
 * A simple CMS-style static page: an admin-authored title + rich-text body,
 * managed entirely in the Directus Data Studio (no page-builder UI in the
 * app itself). Starting content: guides like "How to benefit from NHS
 * insurance and health services in the UK". Only `published` pages are ever
 * read back by the app, so a page can be drafted and reviewed before going
 * live.
 */
export const pageStatusSchema = z.enum(["draft", "published"]);
export type PageStatus = z.infer<typeof pageStatusSchema>;

export const pageSchema = z.object({
  id: z.string().min(1),
  slug: slugSchema,
  title: z.string().min(1),
  /** Rich-text HTML authored via the Directus WYSIWYG editor. */
  body: z.string().min(1),
  status: pageStatusSchema.default("draft"),
  createdAt: z.string().min(1),
  updatedAt: z.string().min(1),
});

export type Page = z.infer<typeof pageSchema>;

export const pagesFileSchema = z.array(pageSchema);
