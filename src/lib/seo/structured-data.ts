import type { Provider } from "@/lib/schemas/provider";
import type { Organization } from "@/lib/schemas/organization";
import type { Speciality } from "@/lib/schemas/speciality";
import { LANGUAGE_LABELS } from "@/lib/constants/languages";
import { SITE_URL } from "@/lib/constants/site";
import {
  PROVIDER_CATEGORY_ROUTES,
  ORGANIZATION_TYPE_ROUTES,
} from "@/lib/constants/categories";

const ORGANIZATION_SCHEMA_TYPE: Record<Organization["type"], string> = {
  clinic: "MedicalClinic",
  hospital: "Hospital",
  pharmacy: "Pharmacy",
};

function openingHoursSpecification(organization: Organization) {
  return organization.openingHours
    .filter((entry) => !entry.closed && entry.opens && entry.closes)
    .map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${entry.day.charAt(0).toUpperCase()}${entry.day.slice(1)}`,
      opens: entry.opens,
      closes: entry.closes,
    }));
}

export function organizationJsonLd(
  organization: Organization,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": ORGANIZATION_SCHEMA_TYPE[organization.type],
    name: organization.name,
    description: organization.description,
    url: `${SITE_URL}/${ORGANIZATION_TYPE_ROUTES[organization.type]}/${organization.slug}`,
    telephone: organization.contact.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: [organization.address.line1, organization.address.line2]
        .filter(Boolean)
        .join(", "),
      addressLocality: organization.address.city,
      postalCode: organization.address.postcode,
      addressRegion: organization.address.region,
      addressCountry: "GB",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: organization.geo.lat,
      longitude: organization.geo.lng,
    },
    openingHoursSpecification: openingHoursSpecification(organization),
    availableLanguage: organization.languagesSpoken.map(
      (code) => LANGUAGE_LABELS[code],
    ),
  };
}

export function providerJsonLd(
  provider: Provider,
  specialities: Speciality[],
  organizations: Organization[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: `${provider.title} ${provider.name}`,
    jobTitle:
      provider.category.charAt(0).toUpperCase() + provider.category.slice(1),
    description: provider.bio,
    url: `${SITE_URL}/${PROVIDER_CATEGORY_ROUTES[provider.category]}/${provider.slug}`,
    knowsLanguage: provider.languagesSpoken.map(
      (code) => LANGUAGE_LABELS[code],
    ),
    knowsAbout: specialities.map((speciality) => speciality.name),
    worksFor: organizations.map((organization) => ({
      "@type": ORGANIZATION_SCHEMA_TYPE[organization.type],
      name: organization.name,
      url: `${SITE_URL}/${ORGANIZATION_TYPE_ROUTES[organization.type]}/${organization.slug}`,
    })),
  };
}
