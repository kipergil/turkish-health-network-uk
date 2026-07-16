import { Languages } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TurkishSpeakingBadge() {
  return (
    <Badge variant="secondary" className="gap-1">
      <Languages className="size-3" aria-hidden="true" />
      Turkish-speaking
    </Badge>
  );
}
