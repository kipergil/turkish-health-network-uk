import type { Metadata } from "next";
import {
  PROVIDER_CATEGORY_LABELS,
  PROVIDER_CATEGORY_PLURAL_LABELS,
  ORGANIZATION_TYPE_PLURAL_LABELS,
  type ProviderCategory,
  type OrganizationType,
} from "@/lib/constants/categories";
import type { Provider } from "@/lib/schemas/provider";
import type { Organization } from "@/lib/schemas/organization";

export function providerCategoryMetadata(category: ProviderCategory): Metadata {
  const plural = PROVIDER_CATEGORY_PLURAL_LABELS[category];
  return {
    title: plural,
    description: `Find Turkish-speaking ${PROVIDER_CATEGORY_LABELS[category].toLowerCase()}s across the UK. Filter by speciality, NHS or private status, language and insurance.`,
  };
}

export function organizationTypeMetadata(type: OrganizationType): Metadata {
  const plural = ORGANIZATION_TYPE_PLURAL_LABELS[type];
  return {
    title: plural,
    description: `Find ${plural.toLowerCase()} serving the Turkish-speaking community across the UK. Filter by NHS or private status, language and insurance.`,
  };
}

export function providerProfileMetadata(provider: Provider): Metadata {
  const title = `${provider.title} ${provider.name}`;
  return {
    title,
    description: provider.bio,
  };
}

export function organizationProfileMetadata(
  organization: Organization,
): Metadata {
  return {
    title: organization.name,
    description: organization.description,
  };
}
