import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCurrentLanguage } from "@/lib/i18n/current-language";
import { t } from "@/lib/i18n/messages";
import { googleSearchUrl } from "@/lib/search";

/** Opens a Google search for `query` in a new tab, for more details than this listing carries. */
export async function GoogleSearchLink({ query }: { query: string }) {
  const language = await getCurrentLanguage();
  return (
    <Button variant="outline" size="sm" asChild>
      <a
        href={googleSearchUrl(query)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Search aria-hidden="true" />
        {t("search_on_google", language)}
      </a>
    </Button>
  );
}
