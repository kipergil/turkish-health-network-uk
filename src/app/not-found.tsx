import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="text-primary text-sm font-medium">404</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
        Page not found
      </h1>
      <p className="text-muted-foreground mt-3">
        The page you&apos;re looking for doesn&apos;t exist, or may have been
        moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/search">Search the network</Link>
        </Button>
      </div>
    </div>
  );
}
