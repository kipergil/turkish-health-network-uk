import { MapPin } from "lucide-react";
import { googleMapsPlaceUrl } from "@/lib/geo";

/**
 * A lightweight, drawn (not tiled) map preview — links straight to the
 * place's real Google Maps listing rather than embedding a map API.
 */
export function LocationPreview({
  label,
  placeQuery,
}: {
  label: string;
  placeQuery: string;
}) {
  return (
    <a
      href={googleMapsPlaceUrl(placeQuery)}
      target="_blank"
      rel="noopener noreferrer"
      className="border-border bg-card hover:border-primary/40 block overflow-hidden rounded-lg border transition-colors"
    >
      <div className="bg-accent flex h-24 items-center justify-center">
        <MapPin className="text-primary size-6" aria-hidden="true" />
      </div>
      <p className="text-muted-foreground px-3 py-2 text-xs">{label}</p>
    </a>
  );
}
