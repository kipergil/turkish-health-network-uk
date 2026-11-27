"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DirectoryResultCard } from "@/components/search/directory-result-card";
import { TurkeyReferralResultCard } from "@/components/search/turkey-referral-result-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ResultsView } from "@/components/shared/results-view";
import type { MapEntry } from "@/components/map/network-map";
import { LANGUAGE_LABELS } from "@/lib/constants/languages";
import { TURKEY_REFERRAL_KIND_LABELS } from "@/lib/constants/turkey-referrals";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import type { DirectoryEntry } from "@/lib/directory";
import type { TurkeyReferral } from "@/lib/schemas/turkey-referral";

const ALL_VALUE = "all";

interface SearchableEntry extends DirectoryEntry {
  languageNames: string[];
}

/** A filter option list built from whatever's actually present in the data, not a fixed constant list. */
function uniqueOptions(values: readonly string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

function FilterSelect({
  id,
  label,
  value,
  onValueChange,
  allLabel,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  allLabel: string;
  options: { value: string; label: string }[];
}) {
  if (options.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL_VALUE}>{allLabel}</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function SearchExperience({
  entries,
  turkeyReferrals,
  initialQuery = "",
  language = DEFAULT_LANGUAGE,
}: {
  entries: DirectoryEntry[];
  turkeyReferrals: TurkeyReferral[];
  initialQuery?: string;
  language?: LanguageCode;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [ukCategory, setUkCategory] = useState(ALL_VALUE);
  const [ukSpeciality, setUkSpeciality] = useState(ALL_VALUE);
  const [trKind, setTrKind] = useState(ALL_VALUE);
  const [trSpeciality, setTrSpeciality] = useState(ALL_VALUE);

  const searchableEntries = useMemo<SearchableEntry[]>(
    () =>
      entries.map((entry) => ({
        ...entry,
        languageNames: entry.languagesSpoken.map(
          (code) => LANGUAGE_LABELS[code],
        ),
      })),
    [entries],
  );

  const ukFuse = useMemo(
    () =>
      new Fuse(searchableEntries, {
        keys: [
          { name: "name", weight: 3 },
          { name: "categoryLabel", weight: 2 },
          { name: "specialities", weight: 1.75 },
          { name: "city", weight: 1.5 },
          { name: "languageNames", weight: 1.5 },
          { name: "summary", weight: 1 },
        ],
        threshold: 0.32,
        ignoreLocation: true,
      }),
    [searchableEntries],
  );

  const trFuse = useMemo(
    () =>
      new Fuse(turkeyReferrals, {
        keys: [
          { name: "name", weight: 3 },
          { name: "specialityText", weight: 2 },
          { name: "city", weight: 1.5 },
          { name: "affiliation", weight: 1 },
          { name: "notes", weight: 0.75 },
        ],
        threshold: 0.32,
        ignoreLocation: true,
      }),
    [turkeyReferrals],
  );

  // An empty keyword is a valid search: it just means "browse everything".
  const ukSearched = useMemo(() => {
    if (query.trim().length === 0) return searchableEntries;
    return ukFuse.search(query).map((result) => result.item);
  }, [ukFuse, query, searchableEntries]);

  const trSearched = useMemo(() => {
    if (query.trim().length === 0) return turkeyReferrals;
    return trFuse.search(query).map((result) => result.item);
  }, [trFuse, query, turkeyReferrals]);

  const ukCategoryOptions = useMemo(
    () =>
      uniqueOptions(entries.map((entry) => entry.categoryLabel)).map(
        (value) => ({ value, label: value }),
      ),
    [entries],
  );
  const ukSpecialityOptions = useMemo(
    () =>
      uniqueOptions(entries.flatMap((entry) => entry.specialities)).map(
        (value) => ({ value, label: value }),
      ),
    [entries],
  );
  const trKindOptions = useMemo(
    () =>
      uniqueOptions(turkeyReferrals.map((referral) => referral.kind)).map(
        (value) => ({
          value,
          label:
            TURKEY_REFERRAL_KIND_LABELS[
              value as keyof typeof TURKEY_REFERRAL_KIND_LABELS
            ],
        }),
      ),
    [turkeyReferrals],
  );
  const trSpecialityOptions = useMemo(
    () =>
      uniqueOptions(
        turkeyReferrals.map((referral) => referral.specialityText),
      ).map((value) => ({ value, label: value })),
    [turkeyReferrals],
  );

  const ukResults = useMemo(
    () =>
      ukSearched.filter(
        (entry) =>
          (ukCategory === ALL_VALUE || entry.categoryLabel === ukCategory) &&
          (ukSpeciality === ALL_VALUE ||
            entry.specialities.includes(ukSpeciality)),
      ),
    [ukSearched, ukCategory, ukSpeciality],
  );

  const trResults = useMemo(
    () =>
      trSearched.filter(
        (referral) =>
          (trKind === ALL_VALUE || referral.kind === trKind) &&
          (trSpeciality === ALL_VALUE ||
            referral.specialityText === trSpeciality),
      ),
    [trSearched, trKind, trSpeciality],
  );

  const mapEntries: MapEntry[] = ukResults
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

  const ukFiltersActive = ukCategory !== ALL_VALUE || ukSpeciality !== ALL_VALUE;
  const trFiltersActive = trKind !== ALL_VALUE || trSpeciality !== ALL_VALUE;

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

      <Tabs defaultValue="uk">
        <TabsList>
          <TabsTrigger value="uk">UK Network ({ukResults.length})</TabsTrigger>
          <TabsTrigger value="turkey">
            Recommended in Turkey ({trResults.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="uk" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <FilterSelect
              id="filter-uk-category"
              label="Type"
              value={ukCategory}
              onValueChange={setUkCategory}
              allLabel="All types"
              options={ukCategoryOptions}
            />
            <FilterSelect
              id="filter-uk-speciality"
              label="Branch"
              value={ukSpeciality}
              onValueChange={setUkSpeciality}
              allLabel="All branches"
              options={ukSpecialityOptions}
            />
            {ukFiltersActive && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setUkCategory(ALL_VALUE);
                  setUkSpeciality(ALL_VALUE);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          <p className="text-muted-foreground text-sm" role="status">
            {ukResults.length} {ukResults.length === 1 ? "result" : "results"}
          </p>

          {ukResults.length === 0 ? (
            <EmptyState
              title="No matches"
              description="Try a different name, city, speciality or language."
            />
          ) : (
            <ResultsView mapEntries={mapEntries} totalCount={ukResults.length}>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ukResults.map((entry) => (
                  <DirectoryResultCard
                    key={`${entry.kind}-${entry.id}`}
                    entry={entry}
                    language={language}
                  />
                ))}
              </div>
            </ResultsView>
          )}
        </TabsContent>

        <TabsContent value="turkey" className="mt-4 space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <FilterSelect
              id="filter-tr-kind"
              label="Type"
              value={trKind}
              onValueChange={setTrKind}
              allLabel="All types"
              options={trKindOptions}
            />
            <FilterSelect
              id="filter-tr-speciality"
              label="Branch"
              value={trSpeciality}
              onValueChange={setTrSpeciality}
              allLabel="All branches"
              options={trSpecialityOptions}
            />
            {trFiltersActive && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTrKind(ALL_VALUE);
                  setTrSpeciality(ALL_VALUE);
                }}
              >
                Clear filters
              </Button>
            )}
          </div>

          <p className="text-muted-foreground text-sm" role="status">
            {trResults.length} {trResults.length === 1 ? "result" : "results"}
          </p>

          {trResults.length === 0 ? (
            <EmptyState
              title="No matches"
              description="Try a different name, city or branch."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trResults.map((referral) => (
                <TurkeyReferralResultCard
                  key={referral.id}
                  referral={referral}
                  language={language}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
