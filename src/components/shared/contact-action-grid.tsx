import type { LucideIcon } from "lucide-react";
import { AtSign, Globe, Mail, MapPin, Navigation, Phone, Search } from "lucide-react";
import { getCurrentLanguage } from "@/lib/i18n/current-language";
import { t, type MessageKey } from "@/lib/i18n/messages";
import { googleMapsDirectionsUrl, googleMapsSearchUrl } from "@/lib/geo";
import { googleSearchUrl } from "@/lib/search";
import type { ContactInfo, GeoPoint } from "@/lib/schemas/common";

function ActionTile({
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
      className="border-border bg-card hover:border-primary/40 hover:bg-accent flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border p-2 text-center transition-colors"
    >
      <Icon className="size-5" aria-hidden="true" />
      <span className="text-xs leading-tight font-medium">{label}</span>
    </a>
  );
}

/**
 * Every contact/wayfinding action (call, email, website, Instagram, maps,
 * directions, Google search) as one uniform grid of square icon tiles,
 * shared by both provider and organization profile pages instead of each
 * keeping its own mix of plain text links and full-width buttons.
 */
export async function ContactActionGrid({
  contact,
  geo,
  googleSearchQuery,
}: {
  contact: ContactInfo;
  geo?: GeoPoint;
  googleSearchQuery: string;
}) {
  const language = await getCurrentLanguage();
  const label = (key: MessageKey) => t(key, language);

  return (
    <div className="grid grid-cols-3 gap-2">
      {contact.phone ? (
        <ActionTile
          href={`tel:${contact.phone}`}
          icon={Phone}
          label={label("contact_call")}
          external={false}
        />
      ) : null}
      {contact.email ? (
        <ActionTile
          href={`mailto:${contact.email}`}
          icon={Mail}
          label={label("contact_email")}
          external={false}
        />
      ) : null}
      {contact.website ? (
        <ActionTile
          href={contact.website}
          icon={Globe}
          label={label("contact_website")}
        />
      ) : null}
      {contact.instagram ? (
        <ActionTile
          href={contact.instagram}
          icon={AtSign}
          label={label("contact_instagram")}
        />
      ) : null}
      {geo ? (
        <ActionTile
          href={googleMapsSearchUrl(geo)}
          icon={MapPin}
          label={label("contact_maps")}
        />
      ) : null}
      {geo ? (
        <ActionTile
          href={googleMapsDirectionsUrl(geo)}
          icon={Navigation}
          label={label("contact_directions")}
        />
      ) : null}
      <ActionTile
        href={googleSearchUrl(googleSearchQuery)}
        icon={Search}
        label={label("contact_search")}
      />
    </div>
  );
}
