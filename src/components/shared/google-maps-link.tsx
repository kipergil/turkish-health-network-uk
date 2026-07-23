import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentLanguage } from "@/lib/i18n/current-language";
import { t } from "@/lib/i18n/messages";
import { googleMapsDirectionsUrl, googleMapsSearchUrl } from "@/lib/geo";
import type { GeoPoint } from "@/lib/schemas/common";

export async function GoogleMapsLink({ geo }: { geo: GeoPoint }) {
  const language = await getCurrentLanguage();
  return (
    <Button variant="outline" size="sm" asChild>
      <a
        href={googleMapsSearchUrl(geo)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <MapPin aria-hidden="true" />
        {t("view_on_google_maps", language)}
      </a>
    </Button>
  );
}

export async function GoogleMapsDirectionsLink({ geo }: { geo: GeoPoint }) {
  const language = await getCurrentLanguage();
  return (
    <Button variant="outline" size="sm" asChild>
      <a
        href={googleMapsDirectionsUrl(geo)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Navigation aria-hidden="true" />
        {t("get_directions", language)}
      </a>
    </Button>
  );
}
