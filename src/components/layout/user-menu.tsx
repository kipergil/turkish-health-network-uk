"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

/**
 * Client component so signed-in state renders via Clerk's hydrated
 * client-side auth context (`useUser`) instead of a server-side auth
 * check in the root layout — keeping directory pages statically
 * renderable rather than forcing the whole app dynamic on every request.
 */
export function UserMenu() {
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
    return <UserButton />;
  }

  return (
    <SignInButton mode="modal">
      <Button variant="ghost" size="sm">
        Sign in
      </Button>
    </SignInButton>
  );
}
