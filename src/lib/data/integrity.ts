import "server-only";

/**
 * Fails fast at module-load (i.e. at build time) if a JSON record
 * references an id that doesn't exist in the target collection. Hand
 * maintained JSON has no foreign-key constraint to catch typos for us —
 * this is the closest equivalent until a real database is introduced.
 */
export function assertReferencesExist(
  sourceLabel: string,
  targetLabel: string,
  referencedIds: Iterable<string>,
  validIds: ReadonlySet<string>,
): void {
  const missing = new Set<string>();
  for (const id of referencedIds) {
    if (!validIds.has(id)) {
      missing.add(id);
    }
  }
  if (missing.size > 0) {
    throw new Error(
      `${sourceLabel} reference(s) unknown ${targetLabel} id(s): ${[...missing].join(", ")}`,
    );
  }
}
