"use client";

import { useMemo, useState } from "react";
import { NetworkMap, type MapEntry } from "@/components/map/network-map";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function MapExplorer({ entries }: { entries: MapEntry[] }) {
  const categories = useMemo(
    () =>
      Array.from(new Set(entries.map((entry) => entry.categoryLabel))).sort(),
    [entries],
  );
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    () => new Set(categories),
  );

  const visibleEntries = useMemo(
    () => entries.filter((entry) => activeCategories.has(entry.categoryLabel)),
    [entries, activeCategories],
  );

  function toggleCategory(category: string, checked: boolean) {
    setActiveCategories((previous) => {
      const next = new Set(previous);
      if (checked) next.add(category);
      else next.delete(category);
      return next;
    });
  }

  return (
    <div className="space-y-4">
      <fieldset className="border-border bg-card flex flex-wrap gap-x-4 gap-y-2 rounded-lg border p-4">
        <legend className="px-1 text-sm font-medium">Show on map</legend>
        {categories.map((category) => (
          <div key={category} className="flex items-center gap-2">
            <Checkbox
              id={`map-cat-${category}`}
              checked={activeCategories.has(category)}
              onCheckedChange={(checked) =>
                toggleCategory(category, checked === true)
              }
            />
            <Label htmlFor={`map-cat-${category}`} className="font-normal">
              {category}
            </Label>
          </div>
        ))}
      </fieldset>

      <p className="text-muted-foreground text-sm" role="status">
        Showing {visibleEntries.length} of {entries.length} locations
      </p>

      <NetworkMap
        entries={visibleEntries}
        className="border-border h-[70vh] min-h-100 rounded-lg border"
      />
    </div>
  );
}
