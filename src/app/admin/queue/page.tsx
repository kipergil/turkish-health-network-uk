import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { isAdmin } from "@/lib/admin";
import {
  moderateListingSuggestionAction,
  moderateReviewAction,
} from "@/lib/actions/member-actions";
import {
  getAllOrganizations,
  getAllProviders,
  getPendingListingSuggestions,
  getPendingReviews,
} from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";

export const metadata: Metadata = {
  title: "Moderation queue",
  robots: { index: false, follow: false },
};

export default async function AdminQueuePage() {
  if (!(await isAdmin())) {
    notFound();
  }

  const [reviews, suggestions, providers, organizations] = await Promise.all([
    getPendingReviews(),
    getPendingListingSuggestions(),
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Moderation queue
      </h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Pending reviews and suggested listings, oldest first. Approving a
        suggestion just marks it reviewed — you still add the real
        provider/organization record in Directus yourself.
      </p>

      <section aria-labelledby="reviews-heading" className="mt-10">
        <h2 id="reviews-heading" className="text-lg font-semibold">
          Reviews ({reviews.length})
        </h2>
        {reviews.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No reviews waiting"
              description="New submissions will show up here."
            />
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                    {subjectNameById.get(review.subjectId) ?? review.subjectId}
                    <Badge variant="outline">{review.rating} / 5</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {review.comment ? (
                    <p className="text-foreground">{review.comment}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No comment left.
                    </p>
                  )}
                  <p className="text-muted-foreground text-xs">
                    Submitted{" "}
                    {new Date(review.createdAt).toLocaleDateString("en-GB")}
                  </p>
                  <div className="flex gap-2">
                    <form
                      action={moderateReviewAction.bind(
                        null,
                        review.id,
                        "published",
                      )}
                    >
                      <Button type="submit" size="sm">
                        Approve
                      </Button>
                    </form>
                    <form
                      action={moderateReviewAction.bind(
                        null,
                        review.id,
                        "rejected",
                      )}
                    >
                      <Button type="submit" size="sm" variant="outline">
                        Reject
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="suggestions-heading" className="mt-10">
        <h2 id="suggestions-heading" className="text-lg font-semibold">
          Suggested listings ({suggestions.length})
        </h2>
        {suggestions.length === 0 ? (
          <div className="mt-3">
            <EmptyState
              title="No suggestions waiting"
              description="New submissions will show up here."
            />
          </div>
        ) : (
          <div className="mt-3 space-y-3">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id}>
                <CardHeader>
                  <CardTitle className="flex flex-wrap items-center gap-2 text-base">
                    {suggestion.name}
                    <Badge variant="outline">{suggestion.kind}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1.5 text-sm">
                  {suggestion.categoryText ? (
                    <p>{suggestion.categoryText}</p>
                  ) : null}
                  {suggestion.city ? (
                    <p className="text-muted-foreground">{suggestion.city}</p>
                  ) : null}
                  {suggestion.phone ? <p>{suggestion.phone}</p> : null}
                  {suggestion.website ? (
                    <p>
                      <a
                        href={suggestion.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {suggestion.website}
                      </a>
                    </p>
                  ) : null}
                  {suggestion.notes ? (
                    <p className="text-muted-foreground">{suggestion.notes}</p>
                  ) : null}
                  <p className="text-muted-foreground text-xs">
                    Submitted{" "}
                    {new Date(suggestion.createdAt).toLocaleDateString("en-GB")}
                  </p>
                  <div className="flex gap-2 pt-1.5">
                    <form
                      action={moderateListingSuggestionAction.bind(
                        null,
                        suggestion.id,
                        "approved",
                      )}
                    >
                      <Button type="submit" size="sm">
                        Approve
                      </Button>
                    </form>
                    <form
                      action={moderateListingSuggestionAction.bind(
                        null,
                        suggestion.id,
                        "rejected",
                      )}
                    >
                      <Button type="submit" size="sm" variant="outline">
                        Reject
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
