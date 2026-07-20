import type { Metadata } from "next";
import { SignUp } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Sign up",
};

export default function SignUpPage() {
  return (
    <div className="mx-auto flex max-w-md justify-center px-4 py-16 sm:px-6">
      <SignUp />
    </div>
  );
}
