import { Badge } from "@/components/ui/badge";
import { NHS_STATUS_LABELS, type NhsStatus } from "@/lib/constants/categories";
import { cn } from "@/lib/utils";

// Deliberately not the brand blue (--primary) here: these badges sit next to
// primary-coloured buttons/links throughout the app, and NHS/private/both
// need to read as a distinct status system, not blend into the brand colour.
const NHS_STATUS_STYLES: Record<NhsStatus, string> = {
  nhs: "bg-cyan-700 text-white [a]:hover:bg-cyan-700/90",
  private: "bg-secondary text-secondary-foreground",
  both: "bg-emerald-700 text-white [a]:hover:bg-emerald-700/90",
};

export function NhsStatusBadge({
  status,
  className,
}: {
  status: NhsStatus;
  className?: string;
}) {
  return (
    <Badge className={cn(NHS_STATUS_STYLES[status], className)}>
      {NHS_STATUS_LABELS[status]}
    </Badge>
  );
}
