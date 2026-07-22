import "server-only";
import { currentUser } from "@clerk/nextjs/server";

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

/** True if the signed-in user's email is in the `ADMIN_EMAILS` allowlist. */
export async function isAdmin(): Promise<boolean> {
  const emails = adminEmails();
  if (emails.length === 0) return false;

  const user = await currentUser();
  if (!user) return false;

  return user.emailAddresses.some((address) =>
    emails.includes(address.emailAddress.toLowerCase()),
  );
}
