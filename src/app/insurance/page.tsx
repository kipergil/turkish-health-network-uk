import type { Metadata } from "next";
import { InsuranceCard } from "@/components/insurance/insurance-card";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { getAllInsurances } from "@/lib/data";

export const metadata: Metadata = {
  title: "Insurance",
  description:
    "Private health insurers, cash plans and NHS schemes accepted by doctors, dentists, clinics and hospitals in the Turkish Health Network UK.",
};

export default async function InsurancePage() {
  const insurances = await getAllInsurances();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <PageBreadcrumbs items={[{ label: "Insurance" }]} />
      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Insurance
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        See which private insurers, cash plans and NHS schemes are accepted
        across the network, and which providers and organizations accept each
        one.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {insurances.map((insurance) => (
          <InsuranceCard key={insurance.id} insurance={insurance} />
        ))}
      </div>
    </div>
  );
}
