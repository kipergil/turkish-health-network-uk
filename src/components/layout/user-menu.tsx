"use client";

import { Heart, FilePlus } from "lucide-react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n/messages";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";

/**
 * Client component so signed-in state renders via Clerk's hydrated
 * client-side auth context (`useUser`) instead of a server-side auth
 * check in the root layout — keeping directory pages statically
 * renderable rather than forcing the whole app dynamic on every request.
 */
export function UserMenu({
  language = DEFAULT_LANGUAGE,
}: {
  language?: LanguageCode;
}) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div
        className="bg-muted size-8 animate-pulse rounded-full"
        aria-hidden="true"
      />
    );
  }

  if (isSignedIn) {
    return (
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Link
            label={t("nav_favorites", language)}
            href="/favorites"
            labelIcon={<Heart className="size-4" />}
          />
          <UserButton.Link
            label={t("nav_suggest_listing", language)}
            href="/suggest"
            labelIcon={<FilePlus className="size-4" />}
          />
        </UserButton.MenuItems>
      </UserButton>
    );
  }

  return (
    <SignInButton mode="modal">
      <Button variant="ghost" size="sm">
        {t("sign_in", language)}
      </Button>
    </SignInButton>
  );
}
