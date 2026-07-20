import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function SignInPage() {
  return (
    <div className="mx-auto flex max-w-md justify-center px-4 py-16 sm:px-6">
      <SignIn />
    </div>
  );
}
