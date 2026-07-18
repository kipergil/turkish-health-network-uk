"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Deliberately not `NavItem[]`: that type carries a Lucide icon
 * *component reference*, which can't cross the server→client prop
 * boundary (functions aren't serialisable). This client component only
 * ever needs label/href, so it declares its own narrower prop type.
 */
export interface PrimaryNavLink {
  label: string;
  href: string;
}

export function PrimaryNavLinks({ items }: { items: PrimaryNavLink[] }) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "inline-flex h-8 items-center rounded-lg border-b-2 border-transparent px-2.5 text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              "focus-visible:ring-ring/50 focus-visible:ring-3 focus-visible:outline-none",
              isActive ? "border-primary text-primary" : "text-foreground/80",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}
