import { SearchX } from "lucide-react";

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your filters or search terms.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="border-border flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16 text-center">
      <SearchX className="text-muted-foreground size-8" aria-hidden="true" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>
    </div>
  );
}
