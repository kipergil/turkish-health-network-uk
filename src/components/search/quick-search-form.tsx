"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function QuickSearchForm({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <form
      role="search"
      onSubmit={(event) => {
        event.preventDefault();
        const query = value.trim();
        router.push(
          query ? `/search?q=${encodeURIComponent(query)}` : "/search",
        );
      }}
      className={cn(
        "flex w-full items-center gap-2",
        compact ? "max-w-none" : "max-w-xl",
        className,
      )}
    >
      <div className="relative flex-1">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={
            compact ? "Search…" : "Search doctors, dentists, clinics…"
          }
          aria-label="Search the Turkish Health Network directory"
          className={cn("pl-9", value.length > 0 && "pr-8")}
        />
        {value.length > 0 && (
          <button
            type="button"
            onClick={() => setValue("")}
            aria-label="Clear search"
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute top-1/2 right-2 -translate-y-1/2 rounded p-0.5 focus-visible:ring-2 focus-visible:outline-none"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        )}
      </div>
      {compact ? (
        <Button type="submit" size="icon" variant="ghost" aria-label="Search">
          <Search className="size-4" aria-hidden="true" />
        </Button>
      ) : (
        <Button type="submit">Search</Button>
      )}
    </form>
  );
}
