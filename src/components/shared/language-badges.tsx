import { Badge } from "@/components/ui/badge";
import { LANGUAGE_LABELS, type LanguageCode } from "@/lib/constants/languages";

export function LanguageBadges({
  languages,
}: {
  languages: readonly LanguageCode[];
}) {
  if (languages.length === 0) return null;

  return (
    <ul className="flex flex-wrap gap-1.5" aria-label="Languages spoken">
      {languages.map((code) => (
        <li key={code}>
          <Badge variant="outline">{LANGUAGE_LABELS[code]}</Badge>
        </li>
      ))}
    </ul>
  );
}
