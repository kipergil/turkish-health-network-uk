import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentLanguage } from "@/lib/i18n/current-language";
import { t } from "@/lib/i18n/messages";

/** Admin-only "quick edit" link straight to this item's record in the Directus Data Studio. */
export async function DirectusEditLink({
  href,
  iconOnly = false,
}: {
  href: string;
  /** Compact icon-only button, for tight spaces like a card in a grid. */
  iconOnly?: boolean;
}) {
  const language = await getCurrentLanguage();
  const label = t("edit_in_directus", language);

  if (iconOnly) {
    return (
      <Button variant="outline" size="icon" className="size-8 shrink-0" asChild>
        <a href={href} target="_blank" rel="noopener noreferrer">
          <Pencil aria-hidden="true" />
          <span className="sr-only">{label}</span>
        </a>
      </Button>
    );
  }

  return (
    <Button variant="outline" size="sm" asChild>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <Pencil aria-hidden="true" />
        {label}
      </a>
    </Button>
  );
}
