"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import {
  addFavorite,
  createListingSuggestion,
  createReview,
  removeFavorite,
} from "@/lib/data";
import {
  favoriteSubjectKindSchema,
  listingSuggestionKindSchema,
  type FavoriteSubjectKind,
} from "@/lib/schemas";

export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
}

/**
 * Toggles a favorite for the signed-in user. Called directly from a
 * client component's onClick — not gated by proxy.ts (profile pages stay
 * public), so this checks auth itself and reports back rather than
 * throwing, since a signed-out click is an expected, common case here
 * (it should prompt sign-in client-side before ever reaching this far).
 */
export async function toggleFavoriteAction(
  subjectKind: FavoriteSubjectKind,
  subjectId: string,
  isCurrentlyFavorited: boolean,
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) {
    return { status: "error", message: "Sign in to save favorites." };
  }

  const kind = favoriteSubjectKindSchema.parse(subjectKind);

  if (isCurrentlyFavorited) {
    await removeFavorite(userId, kind, subjectId);
  } else {
    await addFavorite(userId, kind, subjectId);
  }

  revalidatePath("/favorites");
  return { status: "success" };
}

export async function submitReviewAction(
  subjectKind: FavoriteSubjectKind,
  subjectId: string,
  profilePath: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) {
    return { status: "error", message: "Sign in to leave a review." };
  }

  const rating = Number(formData.get("rating"));
  const comment = formData.get("comment");

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: "error", message: "Choose a rating from 1 to 5." };
  }

  await createReview({
    subjectKind: favoriteSubjectKindSchema.parse(subjectKind),
    subjectId,
    rating,
    comment:
      typeof comment === "string" && comment.trim()
        ? comment.trim()
        : undefined,
    authorUserId: userId,
  });

  revalidatePath(profilePath);
  return {
    status: "success",
    message: "Thanks — your review is awaiting moderation before it appears.",
  };
}

export async function submitListingSuggestionAction(
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { userId } = await auth();
  if (!userId) {
    return { status: "error", message: "Sign in to suggest a listing." };
  }

  const kindResult = listingSuggestionKindSchema.safeParse(
    formData.get("kind"),
  );
  const name = formData.get("name");

  if (!kindResult.success) {
    return { status: "error", message: "Choose what kind of listing this is." };
  }
  if (typeof name !== "string" || name.trim().length === 0) {
    return { status: "error", message: "Name is required." };
  }

  const asOptionalString = (value: FormDataEntryValue | null) =>
    typeof value === "string" && value.trim().length > 0
      ? value.trim()
      : undefined;

  await createListingSuggestion({
    kind: kindResult.data,
    name: name.trim(),
    categoryText: asOptionalString(formData.get("categoryText")),
    city: asOptionalString(formData.get("city")),
    phone: asOptionalString(formData.get("phone")),
    website: asOptionalString(formData.get("website")),
    notes: asOptionalString(formData.get("notes")),
    submittedByUserId: userId,
  });

  return {
    status: "success",
    message: "Thanks! Your suggestion has been sent for review.",
  };
}
