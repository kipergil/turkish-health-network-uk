import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Admin-only "quick edit" link straight to this item's record in the Directus Data Studio. */
export function DirectusEditLink({
  href,
  iconOnly = false,
}: {
  href: string;
  /** Compact icon-only button, for tight spaces like a card in a grid. */
  iconOnly?: boolean;
}) {
  if (iconOnly) {
    return (
      <Button variant="outline" size="icon" className="size-8 shrink-0" asChild>
        <a href={href} target="_blank" rel="noopener noreferrer">
          <Pencil aria-hidden="true" />
          <span className="sr-only">Edit in Directus</span>
        </a>
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Pencil aria-hidden="true" />
        Edit in Directus
      </a>
    </Button>
  );
}
