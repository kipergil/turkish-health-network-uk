import { Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import { t } from "@/lib/i18n/messages";

/**
 * Plain (non-async) component: also rendered inside the client-side search
 * results tree (search-experience.tsx -> DirectoryResultCard), where a
 * server-only cookies() read isn't allowed — callers must pass `language`.
 */
export function TurkishSpeakingBadge({
  language = DEFAULT_LANGUAGE,
}: {
  language?: LanguageCode;
}) {
  return (
    <Badge variant="secondary" className="gap-1">
      <Languages className="size-3" aria-hidden="true" />
      {t("turkish_speaking", language)}
    </Badge>
  );
}
