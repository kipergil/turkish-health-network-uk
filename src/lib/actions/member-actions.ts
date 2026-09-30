"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import {
  addFavorite,
  createChangeRequest,
  createListingSuggestion,
  createReview,
  removeFavorite,
  updateChangeRequestStatus,
  updateListingSuggestionStatus,
  updateReviewStatus,
} from "@/lib/data";
import {
  changeRequestActionSchema,
  changeRequestStatusSchema,
  favoriteSubjectKindSchema,
  listingSuggestionKindSchema,
  listingSuggestionStatusSchema,
  reviewStatusSchema,
  safeUrlSchema,
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

  const website = asOptionalString(formData.get("website"));
  if (website && !safeUrlSchema.safeParse(website).success) {
    // This is later rendered as a raw `<a href>` in the admin moderation
    // queue (src/app/admin/queue/page.tsx) — an unrestricted scheme here
    // (e.g. `javascript:`) would run script in the moderating admin's
    // signed-in session the moment they click the link.
    return {
      status: "error",
      message: "Enter a valid website address starting with http:// or https://.",
    };
  }

  await createListingSuggestion({
    kind: kindResult.data,
    name: name.trim(),
    categoryText: asOptionalString(formData.get("categoryText")),
    city: asOptionalString(formData.get("city")),
    phone: asOptionalString(formData.get("phone")),
    website,
    notes: asOptionalString(formData.get("notes")),
    submittedByUserId: userId,
  });

  return {
    status: "success",
    message: "Thanks! Your suggestion has been sent for review.",
  };
}

/**
 * Reports that a provider/organization needs updating or removing.
 * Deliberately not gated by `auth()` — anyone browsing the directory can
 * flag a stale or wrong listing, so the reporter's name/email (used only
 * to follow up once an admin has acted) are plain form fields instead.
 */
export async function submitChangeRequestAction(
  subjectKind: FavoriteSubjectKind,
  subjectId: string,
  _previousState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const actionResult = changeRequestActionSchema.safeParse(
    formData.get("action"),
  );
  const reason = formData.get("reason");

  if (!actionResult.success) {
    return { status: "error", message: "Choose what you'd like us to do." };
  }
  if (typeof reason !== "string" || reason.trim().length === 0) {
    return { status: "error", message: "Tell us what needs to change." };
  }

  const asOptionalString = (value: FormDataEntryValue | null) =>
    typeof value === "string" && value.trim().length > 0
      ? value.trim()
      : undefined;

  const reporterEmail = asOptionalString(formData.get("reporterEmail"));
  if (reporterEmail && !z.email().safeParse(reporterEmail).success) {
    return { status: "error", message: "Enter a valid email address." };
  }

  await createChangeRequest({
    subjectKind: favoriteSubjectKindSchema.parse(subjectKind),
    subjectId,
    action: actionResult.data,
    reason: reason.trim(),
    reporterName: asOptionalString(formData.get("reporterName")),
    reporterEmail,
  });

  return {
    status: "success",
    message: "Thanks — we've sent this to our team for review.",
  };
}

/** Admin-only: approve or reject a pending review from the moderation queue. */
export async function moderateReviewAction(
  reviewId: string,
  status: string,
): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Not authorized.");
  }
  await updateReviewStatus(reviewId, reviewStatusSchema.parse(status));
  revalidatePath("/admin/queue");
}

/** Admin-only: mark a pending listing suggestion as approved or rejected. */
export async function moderateListingSuggestionAction(
  suggestionId: string,
  status: string,
): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Not authorized.");
  }
  await updateListingSuggestionStatus(
    suggestionId,
    listingSuggestionStatusSchema.parse(status),
  );
  revalidatePath("/admin/queue");
}

/** Admin-only: mark a pending change request as resolved or rejected. */
export async function moderateChangeRequestAction(
  changeRequestId: string,
  status: string,
): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("Not authorized.");
  }
  await updateChangeRequestStatus(
    changeRequestId,
    changeRequestStatusSchema.parse(status),
  );
  revalidatePath("/admin/queue");
}
