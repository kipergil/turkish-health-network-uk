"use client";

import { List, Map as MapIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NetworkMap, type MapEntry } from "@/components/map/network-map";
import { EmptyState } from "@/components/shared/empty-state";

/**
 * Shared list/map toggle for every directory results page. `children` is
 * the already-rendered list view (server-rendered cards) — only the map
 * needs client state, so this is the only piece that has to be a client
 * component.
 */
export function ResultsView({
  mapEntries,
  totalCount,
  children,
}: {
  mapEntries: MapEntry[];
  totalCount: number;
  children: React.ReactNode;
}) {
  return (
    <Tabs defaultValue="list">
      <TabsList>
        <TabsTrigger
          value="list"
          className="text-muted-foreground data-active:text-foreground gap-1.5"
        >
          <List className="size-4" aria-hidden="true" />
          List
        </TabsTrigger>
        <TabsTrigger
          value="map"
          className="text-muted-foreground data-active:text-foreground gap-1.5"
        >
          <MapIcon className="size-4" aria-hidden="true" />
          Map
        </TabsTrigger>
      </TabsList>

      <TabsContent value="list" className="mt-4">
        {children}
      </TabsContent>

      <TabsContent value="map" className="mt-4">
        {mapEntries.length === 0 ? (
          <EmptyState
            title="No locations to show"
            description="None of these results have map coordinates yet."
          />
        ) : (
          <>
            {mapEntries.length < totalCount && (
              <p className="text-muted-foreground mb-2 text-xs">
                Showing {mapEntries.length} of {totalCount} results with a known
                location.
              </p>
            )}
            <NetworkMap
              entries={mapEntries}
              className="border-border h-[60vh] min-h-100 rounded-lg border"
            />
          </>
        )}
      </TabsContent>
    </Tabs>
  );
}
