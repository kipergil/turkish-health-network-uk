import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";
import { FiltersDisclosure } from "@/components/filters/filters-disclosure";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { TurkeyReferralCard } from "@/components/turkey/turkey-referral-card";
import { TurkeyReferralFilters } from "@/components/turkey/turkey-referral-filters";
import { getAllTurkeyReferrals } from "@/lib/data";
import { TURKEY_REFERRAL_KIND_PLURAL_LABELS } from "@/lib/constants/turkey-referrals";
import type { TurkeyReferralKind } from "@/lib/schemas/turkey-referral";
import {
  filterTurkeyReferrals,
  parseTurkeyReferralFilters,
  type SearchParamsInput,
} from "@/lib/filtering";

export const metadata: Metadata = {
  title: "Recommended in Turkey",
  description:
    "Doctors, dentists and clinics in Turkey recommended by the UK Turkish-speaking community for patients travelling for treatment. Separate from the UK network and not overseen by UK regulators.",
};

const KIND_ORDER: TurkeyReferralKind[] = ["doctor", "dentist", "clinic"];

export default async function TurkeyDoctorsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsInput>;
}) {
  const resolvedSearchParams = await searchParams;
  const referrals = await getAllTurkeyReferrals();
  const verifiedCount = referrals.filter(
    (referral) => referral.verified,
  ).length;

  const specialityOptions = Array.from(
    new Set(referrals.map((referral) => referral.specialityText)),
  ).sort((a, b) => a.localeCompare(b));
  const cityOptions = Array.from(
    new Set(referrals.map((referral) => referral.city)),
  ).sort((a, b) => a.localeCompare(b));

  const filters = parseTurkeyReferralFilters(resolvedSearchParams);
  const filtered = filterTurkeyReferrals(referrals, filters);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageBreadcrumbs items={[{ label: "Recommended in Turkey" }]} />
      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Recommended in Turkey
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Doctors, dentists and clinics in Turkey, recommended within the UK
        Turkish-speaking community for patients travelling for treatment or a
        second opinion. This list is separate from the UK network above.
      </p>

      <div className="mt-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
        <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
        <div className="text-sm">
          <p className="font-medium">
            These providers are based in Turkey, not the UK.
          </p>
          <p className="mt-1">
            They are not registered with UK regulators — the GMC (doctors), GDC
            (dentists) or CQC (clinics) — and UK consumer protections do not
            apply. {verifiedCount} of {referrals.length} entries were
            cross-checked online in July 2026; the rest come directly from
            community recommendations and could not be independently verified.
            Always verify credentials and reviews yourself before travelling for
            treatment.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <FiltersDisclosure>
          <TurkeyReferralFilters
            specialityOptions={specialityOptions}
            cityOptions={cityOptions}
          />
        </FiltersDisclosure>
      </div>

      <p className="text-muted-foreground mt-4 text-sm" role="status">
        {filtered.length} {filtered.length === 1 ? "result" : "results"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-4">
          <EmptyState />
        </div>
      ) : (
        KIND_ORDER.map((kind) => {
          const group = filtered.filter((referral) => referral.kind === kind);
          if (group.length === 0) return null;

          return (
            <section
              key={kind}
              aria-labelledby={`turkey-${kind}-heading`}
              className="mt-8"
            >
              <h2
                id={`turkey-${kind}-heading`}
                className="text-lg font-semibold"
              >
                {TURKEY_REFERRAL_KIND_PLURAL_LABELS[kind]}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((referral) => (
                  <TurkeyReferralCard key={referral.id} referral={referral} />
                ))}
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
