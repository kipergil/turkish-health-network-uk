import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageBreadcrumbs } from "@/components/shared/page-breadcrumbs";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAllOrganizations,
  getAllProviders,
  getListingSuggestionsBySubmitter,
  getReviewsByAuthor,
} from "@/lib/data";
import type { ListingSuggestionStatus } from "@/lib/schemas/listing-suggestion";
import type { ReviewStatus } from "@/lib/schemas/review";

export const metadata: Metadata = {
  title: "My submissions",
  description: "Reviews and listing suggestions you've submitted.",
};

const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  pending: "Pending review",
  published: "Published",
  rejected: "Not published",
};

const SUGGESTION_STATUS_LABEL: Record<ListingSuggestionStatus, string> = {
  pending: "Pending review",
  approved: "Approved",
  rejected: "Not added",
};

export default async function MySubmissionsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const [reviews, suggestions, providers, organizations] = await Promise.all([
    getReviewsByAuthor(userId),
    getListingSuggestionsBySubmitter(userId),
    getAllProviders(),
    getAllOrganizations(),
  ]);

  const subjectNameById = new Map<string, string>();
  for (const provider of providers) {
    subjectNameById.set(provider.id, `${provider.title} ${provider.name}`);
  }
  for (const organization of organizations) {
    subjectNameById.set(organization.id, organization.name);
  }

  const isEmpty = reviews.length === 0 && suggestions.length === 0;

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <PageBreadcrumbs items={[{ label: "My submissions" }]} />
      <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
        My submissions
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Reviews and listing suggestions you&apos;ve sent in, and where each one
        stands.
      </p>

      {isEmpty ? (
        <div className="mt-6">
          <EmptyState
            title="Nothing submitted yet"
            description="Suggested listings and reviews you send in will show up here with their status."
          />
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {reviews.length > 0 && (
            <section aria-labelledby="my-reviews-heading">
              <h2 id="my-reviews-heading" className="text-lg font-semibold">
                Reviews
              </h2>
              <div className="mt-4 space-y-3">
                {reviews.map((review) => (
                  <Card key={review.id}>
                    <CardHeader>
                      <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                        <span>
                          {subjectNameById.get(review.subjectId) ?? "A listing"}
                        </span>
                        <Badge
                          variant={
                            review.status === "published"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {REVIEW_STATUS_LABEL[review.status]}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    {review.comment ? (
                      <CardContent className="text-sm">
                        {review.comment}
                      </CardContent>
                    ) : null}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {suggestions.length > 0 && (
            <section aria-labelledby="my-suggestions-heading">
              <h2 id="my-suggestions-heading" className="text-lg font-semibold">
                Suggested listings
              </h2>
              <div className="mt-4 space-y-3">
                {suggestions.map((suggestion) => (
                  <Card key={suggestion.id}>
                    <CardHeader>
                      <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
                        <span>{suggestion.name}</span>
                        <Badge
                          variant={
                            suggestion.status === "approved"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {SUGGESTION_STATUS_LABEL[suggestion.status]}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
