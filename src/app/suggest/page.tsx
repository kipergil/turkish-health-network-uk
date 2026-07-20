import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { SuggestionForm } from "@/components/suggestions/suggestion-form";

export const metadata: Metadata = {
  title: "Suggest a listing",
  description:
    "Suggest a doctor, clinic or organization to add to the network.",
};

export default async function SuggestPage() {
  // `src/proxy.ts` also gates this route, but Clerk's own middleware-based
  // route matching (createRouteMatcher) is deprecated in favor of checking
  // auth directly in the resource that needs it — this is the primary
  // guard, proxy.ts is defense in depth.
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <PageBreadcrumbs items={[{ label: "Suggest a listing" }]} />
      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        Suggest a listing
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Know a Turkish-speaking doctor, dentist, clinic or hospital that
        isn&apos;t listed yet? Send us the details and we&apos;ll review it for
        the directory.
      </p>

      <div className="mt-6">
        <SuggestionForm />
      </div>
    </div>
  );
}
