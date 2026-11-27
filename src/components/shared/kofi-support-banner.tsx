import { Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KOFI_URL, SITE_NAME } from "@/lib/constants/site";

/**
 * Eye-catching, deliberately distinct from the muted card style used
 * elsewhere on the page (gradient background, Ko-fi's own red) so it reads
 * as a genuine ask rather than blending into the rest of the chrome.
 */
export function KofiSupportBanner() {
  return (
    <section
      aria-labelledby="support-heading"
      className="border-border border-t bg-gradient-to-br from-[#FF5E5B]/15 via-[#FF5E5B]/5 to-transparent"
    >
      <div className="mx-auto max-w-2xl px-4 py-14 text-center sm:px-6 sm:py-16">
        <span className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-[#FF5E5B]/30 bg-[#FF5E5B]/10 px-3 py-1 text-xs font-medium text-[#FF5E5B]">
          <Coffee className="size-3.5" aria-hidden="true" />
          Independently run
        </span>
        <h2
          id="support-heading"
          className="mt-4 text-2xl font-bold tracking-tight text-balance sm:text-3xl"
        >
          Enjoying {SITE_NAME}? Help keep it running.
        </h2>
        <p className="text-muted-foreground mt-3">
          This directory is free, ad-free, and built and maintained in spare
          time so the community can find care in their own language. If
          it&apos;s saved you a phone call or a confusing appointment, a small
          donation covers hosting and helps the listings keep growing.
        </p>
        <Button
          asChild
          size="lg"
          className="mt-6 bg-[#FF5E5B] text-white hover:bg-[#FF5E5B]/90"
        >
          <a href={KOFI_URL} target="_blank" rel="noopener noreferrer">
            <Coffee aria-hidden="true" />
            Support on Ko-fi
          </a>
        </Button>
      </div>
    </section>
  );
}
