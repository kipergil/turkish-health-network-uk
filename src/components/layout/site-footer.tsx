import Link from "next/link";
import { HeartPulse, Info } from "lucide-react";
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
    <footer className="border-border from-muted/40 to-muted/70 border-t bg-gradient-to-b">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="from-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg bg-gradient-to-br to-blue-700 dark:to-blue-900">
              <HeartPulse className="size-4.5" aria-hidden="true" />
            </span>
            <span className="font-semibold tracking-tight">{SITE_NAME}</span>
          </Link>
          <p className="text-muted-foreground mt-3 max-w-xs text-sm">
            {SITE_TAGLINE}
          </p>
          <p className="text-muted-foreground mt-4 text-xs">
            Medical emergency? Call{" "}
            <a
              href="tel:999"
              className="text-primary font-medium hover:underline"
            >
              999
            </a>
            . Non-emergency NHS advice:{" "}
            <a
              href="tel:111"
              className="text-primary font-medium hover:underline"
            >
              111
            </a>
            .
          </p>
        </div>

        <nav aria-label="Practitioners">
          <h2 className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
            Practitioners
          </h2>
          <ul className="mt-3 space-y-2.5 text-sm">
            {PROVIDER_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={NHS_DOCTORS_NAV_ITEM.href}
                className="text-muted-foreground hover:text-primary transition-colors"
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
          <ul className="mt-3 space-y-2.5 text-sm">
            {ORGANIZATION_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
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
          <ul className="mt-3 space-y-2.5 text-sm">
            {UTILITY_NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-border border-t px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3">
          <p className="border-primary/20 bg-primary/5 text-foreground flex items-start gap-2.5 rounded-lg border px-3.5 py-3 text-xs leading-relaxed">
            <Info
              className="text-primary mt-0.5 size-4 shrink-0"
              aria-hidden="true"
            />
            <span>
              Bu sitede yer alan bilgiler yapay zekâ (AI) desteğiyle
              derlenmiştir ve yalnızca genel bilgilendirme amacı taşır. Randevu
              almadan veya herhangi bir sağlık hizmetinden yararlanmadan önce,
              lütfen ilgili doktor, klinik, hastane veya kurumla doğrudan
              iletişime geçerek bilgilerin doğruluğunu ve güncelliğini teyit
              ediniz. {SITE_NAME}, sitede yer alan bilgilerin doğruluğundan,
              eksiksizliğinden veya güncelliğinden sorumlu tutulamaz.
            </span>
          </p>
          <p className="text-muted-foreground text-xs">
            © {year} {SITE_NAME}. Community-maintained, open-source directory.
          </p>
        </div>
      </div>
    </footer>
  );
}
