import Link from "next/link";
import {
  PROVIDER_NAV_ITEMS,
  ORGANIZATION_NAV_ITEMS,
  UTILITY_NAV_ITEMS,
  NHS_DOCTORS_NAV_ITEM,
} from "@/lib/constants/nav";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/constants/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-border bg-muted/30 border-t">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-4">
        <div>
          <p className="font-semibold">{SITE_NAME}</p>
          <p className="text-muted-foreground mt-2 text-sm">{SITE_TAGLINE}</p>
        </div>

        <nav aria-label="Practitioners">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Practitioners
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {PROVIDER_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={NHS_DOCTORS_NAV_ITEM.href}
                className="text-muted-foreground hover:text-foreground"
              >
                {NHS_DOCTORS_NAV_ITEM.label}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Places">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Places
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {ORGANIZATION_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Explore">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Explore
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {UTILITY_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-border border-t px-4 py-4 sm:px-6">
        <p className="text-muted-foreground mx-auto max-w-6xl text-xs">
          © {year} {SITE_NAME}. Community-maintained, open-source directory.
          Always verify NHS registration and appointment availability directly
          with the provider.
        </p>
      </div>
    </footer>
  );
}
