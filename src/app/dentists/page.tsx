import type { Metadata } from "next";
import { ProviderCategoryView } from "@/components/providers/provider-category-view";
import { providerCategoryMetadata } from "@/lib/seo/page-metadata";
import type { SearchParamsInput } from "@/lib/filtering";

export const metadata: Metadata = providerCategoryMetadata("dentist");

export default async function DentistsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  return (
    <ProviderCategoryView
      category="dentist"
      searchParams={await searchParams}
    />
  );
}
