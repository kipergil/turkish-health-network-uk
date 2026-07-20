import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Review } from "@/lib/schemas";

export function ReviewList({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No reviews yet — be the first to share your experience.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {reviews.map((review) => (
        <li
          key={review.id}
          className="border-border border-b pb-4 last:border-0 last:pb-0"
        >
          <div
            className="flex items-center gap-0.5"
            aria-label={`${review.rating} out of 5 stars`}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <Star
                key={value}
                className={cn(
                  "size-4",
                  value <= review.rating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground",
                )}
                aria-hidden="true"
              />
            ))}
          </div>
          {review.comment ? (
            <p className="mt-1.5 text-sm">{review.comment}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
