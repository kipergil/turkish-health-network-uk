"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Collapses the (fairly wide) filter bar behind a toggle so the page opens
 * on just the results. Starts open when the URL already carries filter
 * params (e.g. a shared/bookmarked filtered link) so state isn't hidden
 * from the user who navigated straight to it.
 */
export function FiltersDisclosure({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const activeCount = searchParams.size;
  const [open, setOpen] = useState(() => activeCount > 0);

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="gap-2"
      >
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        Filters
        {activeCount > 0 && (
          <Badge variant="secondary" className="px-1.5">
            {activeCount}
          </Badge>
        )}
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
          aria-hidden="true"
        />
      </Button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}
