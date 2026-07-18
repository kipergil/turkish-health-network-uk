import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Insurance } from "@/lib/schemas/insurance";

const INSURANCE_KIND_LABELS: Record<Insurance["kind"], string> = {
  "private-health-insurance": "Private health insurance",
  "cash-plan": "Cash plan",
  "nhs-scheme": "NHS scheme",
};

export function InsuranceCard({ insurance }: { insurance: Insurance }) {
  return (
    <Card className="hover:border-primary/30 h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardHeader className="flex-row items-start gap-3 space-y-0">
        <div className="bg-muted flex size-12 shrink-0 items-center justify-center rounded-full">
          <ShieldCheck
            className="text-muted-foreground size-5"
            aria-hidden="true"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate leading-tight font-semibold">
            <Link
              href={`/insurance/${insurance.slug}`}
              className="focus-visible:ring-ring/50 rounded-sm hover:underline focus-visible:ring-3 focus-visible:outline-none"
            >
              {insurance.name}
            </Link>
          </h3>
          <Badge variant="outline" className="mt-1">
            {INSURANCE_KIND_LABELS[insurance.kind]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {insurance.description}
        </p>
      </CardContent>
    </Card>
  );
}
