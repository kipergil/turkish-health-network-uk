"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGE_LABELS, type LanguageCode } from "@/lib/constants/languages";
import { NHS_STATUS_LABELS, type NhsStatus } from "@/lib/constants/categories";

export interface FilterOption {
  slug: string;
  name: string;
}

export interface DirectoryFiltersProps {
  specialityOptions?: FilterOption[];
  insuranceOptions: FilterOption[];
  languageOptions: LanguageCode[];
}

const ALL_VALUE = "all";

export function DirectoryFilters({
  specialityOptions,
  insuranceOptions,
  languageOptions,
}: DirectoryFiltersProps) {
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

  const toggleTurkish = useCallback(
    (checked: boolean) => {
      updateParam("turkish", checked ? "1" : undefined);
    },
    [updateParam],
  );

  const hasActiveFilters = searchParams.size > 0;

  return (
    <div className="border-border bg-card flex flex-wrap items-end gap-3 rounded-lg border p-4">
      {specialityOptions && specialityOptions.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-speciality">Speciality</Label>
          <Select
            value={searchParams.get("speciality") ?? ALL_VALUE}
            onValueChange={(value) => updateParam("speciality", value)}
          >
            <SelectTrigger id="filter-speciality" className="w-44">
              <SelectValue placeholder="All specialities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_VALUE}>All specialities</SelectItem>
              {specialityOptions.map((option) => (
                <SelectItem key={option.slug} value={option.slug}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-nhs">NHS / Private</Label>
        <Select
          value={searchParams.get("nhs") ?? ALL_VALUE}
          onValueChange={(value) => updateParam("nhs", value)}
        >
          <SelectTrigger id="filter-nhs" className="w-40">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>All</SelectItem>
            {(Object.entries(NHS_STATUS_LABELS) as [NhsStatus, string][]).map(
              ([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ),
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-language">Language</Label>
        <Select
          value={searchParams.get("lang") ?? ALL_VALUE}
          onValueChange={(value) => updateParam("lang", value)}
        >
          <SelectTrigger id="filter-language" className="w-40">
            <SelectValue placeholder="Any language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Any language</SelectItem>
            {languageOptions.map((code) => (
              <SelectItem key={code} value={code}>
                {LANGUAGE_LABELS[code]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="filter-insurance">Insurance</Label>
        <Select
          value={searchParams.get("insurance") ?? ALL_VALUE}
          onValueChange={(value) => updateParam("insurance", value)}
        >
          <SelectTrigger id="filter-insurance" className="w-44">
            <SelectValue placeholder="Any insurance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL_VALUE}>Any insurance</SelectItem>
            {insuranceOptions.map((option) => (
              <SelectItem key={option.slug} value={option.slug}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex h-8 items-center gap-2">
        <Checkbox
          id="filter-turkish"
          checked={searchParams.get("turkish") === "1"}
          onCheckedChange={(checked) => toggleTurkish(checked === true)}
        />
        <Label htmlFor="filter-turkish" className="font-normal">
          Turkish-speaking only
        </Label>
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
