import type { Metadata } from "next";
import { MapExplorer } from "@/components/map/map-explorer";
import type { MapEntry } from "@/components/map/network-map";
import { getDirectoryEntries } from "@/lib/directory";

export const metadata: Metadata = {
  title: "Map",
  description:
    "Explore Turkish-speaking doctors, dentists, clinics, hospitals and pharmacies across the UK on an interactive map.",
};

export default async function MapPage() {
  const entries = await getDirectoryEntries();
  const mapEntries: MapEntry[] = entries
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Map</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Every provider and organization in the network, plotted across the UK.
        Click a pin to view its profile.
      </p>
      <div className="mt-6">
        <MapExplorer entries={mapEntries} />
      </div>
    </div>
  );
}
