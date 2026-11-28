import type { LucideIcon } from "lucide-react";
import { Globe, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { getCurrentLanguage } from "@/lib/i18n/current-language";
import { t, type MessageKey } from "@/lib/i18n/messages";
import { googleMapsDirectionsUrl, googleMapsPlaceUrl } from "@/lib/geo";
import type { ContactInfo, GeoPoint } from "@/lib/schemas/common";

function BarAction({
  href,
  icon: Icon,
  label,
  external = true,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium"
    >
      <Icon className="size-5" aria-hidden="true" />
      {label}
    </a>
  );
}

/**
 * A persistent bottom action bar, mobile only (`md:hidden`) — on a phone
 * the desktop Contact card sits below the whole profile in document
 * order, so without this the single most important action (get in
 * touch) requires scrolling past the entire page first.
 */
export async function MobileContactBar({
  contact,
  location,
}: {
  contact: ContactInfo;
  location?: { geo: GeoPoint; placeQuery: string };
}) {
  const language = await getCurrentLanguage();
  const label = (key: MessageKey) => t(key, language);

  const hasAnyAction = Boolean(
    contact.phone || contact.website || contact.email || location,
  );
  if (!hasAnyAction) return null;

  return (
    <div
      role="navigation"
      aria-label={label("contact_actions")}
      className="border-border bg-card divide-border fixed inset-x-0 bottom-0 z-40 flex divide-x border-t shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:hidden"
    >
      {contact.phone ? (
        <a
          href={`tel:${contact.phone}`}
          className="bg-primary text-primary-foreground flex flex-[1.3] flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-semibold"
        >
          <Phone className="size-5" aria-hidden="true" />
          {label("contact_call")}
        </a>
      ) : null}
      {location ? (
        <BarAction
          href={googleMapsDirectionsUrl(location.geo)}
          icon={Navigation}
          label={label("contact_directions")}
        />
      ) : null}
      {location ? (
        <BarAction
          href={googleMapsPlaceUrl(location.placeQuery)}
          icon={MapPin}
          label={label("contact_maps")}
        />
      ) : null}
      {contact.website ? (
        <BarAction
          href={contact.website}
          icon={Globe}
          label={label("contact_website")}
        />
      ) : null}
      {contact.email ? (
        <BarAction
          href={`mailto:${contact.email}`}
          icon={Mail}
          label={label("contact_email")}
          external={false}
        />
      ) : null}
    </div>
  );
}
