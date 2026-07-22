import "server-only";

/** Deep link to an item's edit page in the Directus Data Studio, e.g. for an admin "quick edit" button. */
export function directusItemAdminUrl(collection: string, id: string): string | null {
  const base = process.env.DIRECTUS_URL;
  if (!base) return null;
  return `${base.replace(/\/$/, "")}/admin/content/${collection}/${id}`;
}
