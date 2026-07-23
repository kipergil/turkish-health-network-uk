"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { setLanguageAction } from "@/lib/actions/language-actions";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/lib/i18n/languages";

export function LanguageSwitcher({ current }: { current: LanguageCode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const currentLanguage =
    SUPPORTED_LANGUAGES.find((language) => language.code === current) ??
    SUPPORTED_LANGUAGES[0];

  function handleSelect(code: LanguageCode) {
    if (code === current) return;
    startTransition(async () => {
      await setLanguageAction(code);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={isPending}
          aria-label={`Change language (currently ${currentLanguage.label})`}
          className="gap-1.5 px-2"
        >
          <span aria-hidden="true" className="text-base leading-none">
            {currentLanguage.flag}
          </span>
          <span className="hidden sm:inline">{currentLanguage.label}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {SUPPORTED_LANGUAGES.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onSelect={() => handleSelect(language.code)}
            className="gap-2"
          >
            <span aria-hidden="true" className="text-base leading-none">
              {language.flag}
            </span>
            {language.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
