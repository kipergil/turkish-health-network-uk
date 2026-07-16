import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { googleMapsDirectionsUrl, googleMapsSearchUrl } from "@/lib/geo";
import type { GeoPoint } from "@/lib/schemas/common";

export function GoogleMapsLink({
  geo,
  label = "View on Google Maps",
}: {
  geo: GeoPoint;
  label?: string;
}) {
  return (
    <Button variant="outline" size="sm" asChild>
      <a
        href={googleMapsSearchUrl(geo)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MapPin aria-hidden="true" />
        {label}
      </a>
    </Button>
  );
}

export function GoogleMapsDirectionsLink({ geo }: { geo: GeoPoint }) {
  return (
    <Button variant="outline" size="sm" asChild>
      <a
        href={googleMapsDirectionsUrl(geo)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Navigation aria-hidden="true" />
        Get directions
      </a>
    </Button>
  );
}
