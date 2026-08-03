"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Next.js only auto-scrolls to top when the new page's top-level content
 * isn't already within the current (pre-navigation) viewport bounds — so
 * scrolling deep down a long list page before clicking through to a tall
 * detail page can land on the new page mid-scroll instead of at the top.
 * Force it explicitly on every route change rather than relying on that
 * heuristic. Keyed on pathname only, so query-string-only updates (e.g.
 * filter changes, which intentionally use `scroll={false}`) are unaffected.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
