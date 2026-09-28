import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Provider/organization photos are admin-entered URLs pointing at
    // whatever site the entity's own photo lives on (their practice
    // website, a directory listing, etc.) — not a fixed set of domains we
    // control, so this can't be a short allowlist. Acceptable here since
    // only admins (via the Directus Data Studio, not any public-facing
    // form) can set these fields; revisit if that trust boundary changes.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
