import type { Metadata } from "next";
import { OrganizationTypeView } from "@/components/organizations/organization-type-view";
import { organizationTypeMetadata } from "@/lib/seo/page-metadata";
import type { SearchParamsInput } from "@/lib/filtering";

export const metadata: Metadata = organizationTypeMetadata("hospital");

export default async function HospitalsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  return (
    <OrganizationTypeView type="hospital" searchParams={await searchParams} />
  );
}
