"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ALL_VALUE = "all";

export function TurkeyReferralFilters({
  specialityOptions,
  cityOptions,
}: {
  specialityOptions: string[];
  cityOptions: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (!value || value === ALL_VALUE) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const query = params.toString();
      startTransition(() => {
        router.push(query ? `${pathname}?${query}` : pathname, {
          scroll: false,
        });
      });
    },
    [pathname, router, searchParams],
  );

  const hasActiveFilters = searchParams.size > 0;

  return (
    <div className="border-border bg-card flex flex-wrap items-end gap-3 rounded-lg border p-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-turkey-speciality">Speciality</Label>
        <Select
          value={searchParams.get("speciality") ?? ALL_VALUE}
          onValueChange={(value) => updateParam("speciality", value)}
        >
          <SelectTrigger id="filter-turkey-speciality" className="w-56">
            <SelectValue placeholder="All specialities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All specialities</SelectItem>
            {specialityOptions.map((speciality) => (
              <SelectItem key={speciality} value={speciality}>
                {speciality}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-turkey-city">City</Label>
        <Select
          value={searchParams.get("city") ?? ALL_VALUE}
          onValueChange={(value) => updateParam("city", value)}
        >
          <SelectTrigger id="filter-turkey-city" className="w-44">
            <SelectValue placeholder="All cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All cities</SelectItem>
            {cityOptions.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(pathname, { scroll: false })}
        >
          Clear filters
        </Button>
      ) : null}
    </div>
  );
}
