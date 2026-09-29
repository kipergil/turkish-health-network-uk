import { LANGUAGE_LABELS, type LanguageCode } from "@/lib/constants/languages";
import { cn } from "@/lib/utils";

const LANGUAGE_FLAGS: Record<LanguageCode, string> = {
  en: "🇬🇧",
  tr: "🇹🇷",
  ar: "🇸🇦",
  el: "🇬🇷",
  bg: "🇧🇬",
  ro: "🇷🇴",
  pl: "🇵🇱",
  ur: "🇵🇰",
  so: "🇸🇴",
};

/**
 * Small flag-emoji row anchored to a card's bottom-right corner — replaces
 * the per-language text badges, which crowded the card body once an entry
 * spoke more than one or two languages.
 */
export function LanguageIndicator({
  languages,
  className,
}: {
  languages: readonly LanguageCode[];
  className?: string;
}) {
  if (languages.length === 0) return null;

  const label = languages.map((code) => LANGUAGE_LABELS[code]).join(", ");

  return (
    <div
      className={cn(
        "absolute right-3 bottom-3 flex items-center gap-0.5 text-sm leading-none",
        className,
      )}
      title={label}
    >
      <span aria-hidden="true">
        {languages.map((code) => LANGUAGE_FLAGS[code]).join(" ")}
      </span>
      <span className="sr-only">Speaks {label}</span>
    </div>
  );
}
