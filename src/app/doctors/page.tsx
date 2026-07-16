import type { Metadata } from "next";
import { ProviderCategoryView } from "@/components/providers/provider-category-view";
import { providerCategoryMetadata } from "@/lib/seo/page-metadata";
import type { SearchParamsInput } from "@/lib/filtering";

export const metadata: Metadata = providerCategoryMetadata("doctor");

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  return (
    <ProviderCategoryView category="doctor" searchParams={await searchParams} />
  );
}
