"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DirectoryResultCard } from "@/components/search/directory-result-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ResultsView } from "@/components/shared/results-view";
import type { MapEntry } from "@/components/map/network-map";
import { LANGUAGE_LABELS } from "@/lib/constants/languages";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import type { DirectoryEntry } from "@/lib/directory";

interface SearchableEntry extends DirectoryEntry {
  languageNames: string[];
}

export function SearchExperience({
  entries,
  initialQuery = "",
  language = DEFAULT_LANGUAGE,
}: {
  entries: DirectoryEntry[];
  initialQuery?: string;
  language?: LanguageCode;
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

  // An empty keyword is a valid search: it just means "browse everything".
  const results = useMemo(() => {
    if (query.trim().length === 0) return searchable;
    return fuse.search(query).map((result) => result.item);
  }, [fuse, query, searchable]);

  const mapEntries: MapEntry[] = results
    .filter(
      (entry): entry is typeof entry & { geo: NonNullable<typeof entry.geo> } =>
        entry.geo !== undefined,
    )
    .map((entry) => ({
      id: entry.id,
      kind: entry.kind,
      name: entry.name,
      href: entry.href,
      categoryLabel: entry.categoryLabel,
      geo: entry.geo,
    }));

  return (
    <div className="space-y-6">
      <form
        role="search"
        onSubmit={(event) => event.preventDefault()}
        className="flex w-full max-w-xl items-center gap-2"
      >
        <div className="relative flex-1">
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
        <Button type="submit">Search</Button>
        {query.length > 0 && (
          <Button type="button" variant="outline" onClick={() => setQuery("")}>
            <X className="size-4" aria-hidden="true" />
            Clear
          </Button>
        )}
      </form>

      <p className="text-muted-foreground text-sm" role="status">
        {results.length} result{results.length === 1 ? "" : "s"}
      </p>

      {results.length === 0 ? (
        <EmptyState
          title="No matches"
          description="Try a different name, city, speciality or language."
        />
      ) : (
        <ResultsView mapEntries={mapEntries} totalCount={results.length}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((entry) => (
              <DirectoryResultCard
                key={`${entry.kind}-${entry.id}`}
                entry={entry}
                language={language}
              />
            ))}
          </div>
        </ResultsView>
      )}
    </div>
  );
}
