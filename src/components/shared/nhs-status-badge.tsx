import { Badge } from "@/components/ui/badge";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import { t } from "@/lib/i18n/messages";
import type { NhsStatus } from "@/lib/constants/categories";
import { cn } from "@/lib/utils";

// Deliberately not the brand ink (--primary) here: these badges sit next to
// primary-coloured buttons/links throughout the app, and NHS/private/both
// need to read as a distinct status system, not blend into the brand colour.
// nhs/both reuse the stamp system's own teal and ochre rather than generic
// Tailwind stock colours, so status badges stay part of the same palette.
const NHS_STATUS_STYLES: Record<NhsStatus, string> = {
  nhs: "bg-status-teal text-white [a]:hover:bg-status-teal/90",
  private: "bg-secondary text-secondary-foreground",
  both: "bg-stamp text-white [a]:hover:bg-stamp/90",
};

const NHS_STATUS_MESSAGE_KEYS = {
  nhs: "nhs_status_nhs",
  private: "nhs_status_private",
  both: "nhs_status_both",
} as const;

/**
 * Plain (non-async) component, not self-fetching the language: this is
 * also rendered inside the client-side search results tree
 * (search-experience.tsx -> DirectoryResultCard), where a server-only
 * cookies() read isn't allowed at all — callers must pass `language`.
 */
export function NhsStatusBadge({
  status,
  className,
  language = DEFAULT_LANGUAGE,
}: {
  status: NhsStatus;
  className?: string;
  language?: LanguageCode;
}) {
  return (
    <Badge className={cn(NHS_STATUS_STYLES[status], className)}>
      {t(NHS_STATUS_MESSAGE_KEYS[status], language)}
    </Badge>
  );
}
