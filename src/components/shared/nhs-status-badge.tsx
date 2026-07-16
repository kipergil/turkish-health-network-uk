import { Badge } from "@/components/ui/badge";
import { NHS_STATUS_LABELS, type NhsStatus } from "@/lib/constants/categories";
import { cn } from "@/lib/utils";

const NHS_STATUS_STYLES: Record<NhsStatus, string> = {
  nhs: "bg-blue-600 text-white [a]:hover:bg-blue-600/90",
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
