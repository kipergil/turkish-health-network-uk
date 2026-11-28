"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";
import { t } from "@/lib/i18n/messages";

/**
 * Native share sheet where available (mostly mobile), falling back to
 * copying the profile link to the clipboard — no toast library in this
 * app, so "copied" is shown as a briefly-swapped checkmark icon instead.
 */
export function ShareButton({
  title,
  language = DEFAULT_LANGUAGE,
}: {
  title: string;
  language?: LanguageCode;
}) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Cancelled or unsupported mid-call — nothing to recover from.
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied — no further fallback.
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleClick}
      aria-label={copied ? t("link_copied", language) : t("share_profile", language)}
    >
      {copied ? (
        <Check className="size-4" aria-hidden="true" />
      ) : (
        <Share2 className="size-4" aria-hidden="true" />
      )}
    </Button>
  );
}
