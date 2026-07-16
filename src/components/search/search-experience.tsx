"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DirectoryResultCard } from "@/components/search/directory-result-card";
import { EmptyState } from "@/components/shared/empty-state";
import { LANGUAGE_LABELS } from "@/lib/constants/languages";
import type { DirectoryEntry } from "@/lib/directory";

interface SearchableEntry extends DirectoryEntry {
  languageNames: string[];
}

export function SearchExperience({
  entries,
  initialQuery = "",
}: {
  entries: DirectoryEntry[];
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);

  const searchable = useMemo<SearchableEntry[]>(
    () =>
      entries.map((entry) => ({
        ...entry,
        languageNames: entry.languagesSpoken.map(
          (code) => LANGUAGE_LABELS[code],
        ),
      })),
    [entries],
  );

  const fuse = useMemo(
    () =>
      new Fuse(searchable, {
        keys: [
          { name: "name", weight: 3 },
          { name: "categoryLabel", weight: 2 },
          { name: "city", weight: 1.5 },
          { name: "languageNames", weight: 1.5 },
          { name: "summary", weight: 1 },
        ],
        threshold: 0.32,
        ignoreLocation: true,
      }),
    [searchable],
  );

  const results = useMemo(() => {
    if (query.trim().length === 0) return searchable;
    return fuse.search(query).map((result) => result.item);
  }, [fuse, query, searchable]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, speciality, city or language…"
          aria-label="Search the Turkish Health Network directory"
          className="pl-9"
          autoFocus
        />
      </div>

      <p className="text-muted-foreground text-sm" role="status">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <EmptyState
          title="No matches"
          description="Try a different name, city, speciality or language."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((entry) => (
            <DirectoryResultCard
              key={`${entry.kind}-${entry.id}`}
              entry={entry}
            />
          ))}
        </div>
      )}
    </div>
  );
}
