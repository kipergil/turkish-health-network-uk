import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { googleSearchUrl } from "@/lib/search";

/** Opens a Google search for `query` in a new tab, for more details than this listing carries. */
export function GoogleSearchLink({ query }: { query: string }) {
  return (
    <Button variant="outline" size="sm" asChild>
      <a
        href={googleSearchUrl(query)}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Search aria-hidden="true" />
        Search on Google
      </a>
    </Button>
  );
}
