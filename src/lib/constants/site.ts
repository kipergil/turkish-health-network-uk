export const SITE_NAME = "Turkish Health Network UK";
export const SITE_TAGLINE = "Turkish-speaking healthcare, across the UK.";
export const SITE_DESCRIPTION =
  "Find Turkish-speaking doctors, dentists, psychologists, physiotherapists, dietitians, clinics, hospitals and pharmacies across the United Kingdom. Search by language, NHS or private status, insurance and location.";

/**
 * Canonical origin for metadata, sitemap and OpenGraph URLs. Overridable
 * via env for preview deployments; falls back to a placeholder domain
 * that should be replaced before going live.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.turkishhealthnetwork.uk"
).replace(/\/$/, "");
