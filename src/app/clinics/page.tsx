import type { Metadata } from "next";
import { OrganizationTypeView } from "@/components/organizations/organization-type-view";
import { organizationTypeMetadata } from "@/lib/seo/page-metadata";
import type { SearchParamsInput } from "@/lib/filtering";

export const metadata: Metadata = organizationTypeMetadata("clinic");

export default async function ClinicsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  return (
    <OrganizationTypeView type="clinic" searchParams={await searchParams} />
  );
}
