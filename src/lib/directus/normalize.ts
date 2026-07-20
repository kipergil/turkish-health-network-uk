/**
 * Directus stores an unset optional field as SQL NULL and returns it as
 * `null`, but every Zod schema in this app uses `.optional()` (accepts
 * `undefined`, not `null`) to match the original JSON-file shape. Recursively
 * convert `null` -> `undefined` before validating so reads from Directus
 * parse the same way the old JSON files did.
 */
export function stripNulls<T>(value: T): T {
  if (value === null) return undefined as T;
  if (Array.isArray(value)) {
    return value.map((item) => stripNulls(item)) as T;
  }
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value)) {
      result[key] = stripNulls(val);
    }
    return result as T;
  }
  return value;
}
