import type { Metadata } from "next";
import { OrganizationTypeView } from "@/components/organizations/organization-type-view";
import { organizationTypeMetadata } from "@/lib/seo/page-metadata";
import type { SearchParamsInput } from "@/lib/filtering";

export const metadata: Metadata = organizationTypeMetadata("pharmacy");

export default async function PharmaciesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  return (
    <OrganizationTypeView type="pharmacy" searchParams={await searchParams} />
  );
}
