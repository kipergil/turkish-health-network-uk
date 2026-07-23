"use client";

import { useState, useTransition } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toggleFavoriteAction } from "@/lib/actions/member-actions";
import { t } from "@/lib/i18n/messages";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import type { FavoriteSubjectKind } from "@/lib/schemas";

export function FavoriteButton({
  subjectKind,
  subjectId,
  initialFavorited,
  language = DEFAULT_LANGUAGE,
}: {
  subjectKind: FavoriteSubjectKind;
  subjectId: string;
  initialFavorited: boolean;
  language?: LanguageCode;
}) {
  const { isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!isLoaded) return;

    if (!isSignedIn) {
      clerk.openSignIn();
      return;
    }

    const next = !favorited;
    setFavorited(next);
    startTransition(async () => {
      const result = await toggleFavoriteAction(
        subjectKind,
        subjectId,
        favorited,
      );
      if (result.status === "error") {
        setFavorited(favorited);
      }
    });
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      aria-pressed={favorited}
      className="gap-1.5"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <Heart
          className={cn("size-4", favorited && "fill-current")}
          aria-hidden="true"
        />
      )}
      {favorited ? t("saved", language) : t("save", language)}
    </Button>
  );
}
