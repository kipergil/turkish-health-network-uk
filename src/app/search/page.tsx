import type { Metadata } from "next";
import { SearchExperience } from "@/components/search/search-experience";
import { getDirectoryEntries } from "@/lib/directory";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Search the whole Turkish Health Network UK directory of doctors, dentists, psychologists, physiotherapists, dietitians, clinics, hospitals and pharmacies.",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const entries = await getDirectoryEntries();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Search the network
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Search across every doctor, dentist, psychologist, physiotherapist,
        dietitian, clinic, hospital and pharmacy in the network.
      </p>
      <div className="mt-6">
        <SearchExperience entries={entries} initialQuery={q ?? ""} />
      </div>
    </div>
  );
}
