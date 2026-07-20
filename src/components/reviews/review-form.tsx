"use client";

import { useActionState, useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  submitReviewAction,
  type ActionState,
} from "@/lib/actions/member-actions";
import type { FavoriteSubjectKind } from "@/lib/schemas";

const INITIAL_STATE: ActionState = { status: "idle" };

export function ReviewForm({
  subjectKind,
  subjectId,
  profilePath,
}: {
  subjectKind: FavoriteSubjectKind;
  subjectId: string;
  profilePath: string;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();
  const [rating, setRating] = useState(0);
  const [state, formAction, isPending] = useActionState(
    submitReviewAction.bind(null, subjectKind, subjectId, profilePath),
    INITIAL_STATE,
  );

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => clerk.openSignIn()}
      >
        Sign in to leave a review
      </Button>
    );
  }

  if (state.status === "success") {
    return <p className="text-muted-foreground text-sm">{state.message}</p>;
  }

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="rating" value={rating} />
      <div>
        <span className="mb-1.5 block text-sm font-medium">Your rating</span>
        <div className="flex gap-1" role="radiogroup" aria-label="Rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={rating === value}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              onClick={() => setRating(value)}
              className="focus-visible:ring-ring/50 rounded p-0.5 focus-visible:ring-2 focus-visible:outline-none"
            >
              <Star
                className={cn(
                  "size-6",
                  value <= rating
                    ? "fill-primary text-primary"
                    : "text-muted-foreground",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <Textarea
        name="comment"
        placeholder="Share your experience (optional)"
        rows={3}
      />

      {state.status === "error" && (
        <p className="text-destructive text-sm" role="alert">
          {state.message}
        </p>
      )}

      <Button type="submit" size="sm" disabled={isPending || rating === 0}>
        {isPending ? "Submitting…" : "Submit review"}
      </Button>
    </form>
  );
}
