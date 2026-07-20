import { clerkMiddleware } from "@clerk/nextjs/server";

// Next.js 16 renamed the `middleware` file convention to `proxy` — see
// node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md.
// `clerkMiddleware()` still returns a plain (request, event) => Response
// handler, so it's exported as `proxy` unchanged.
//
// Route protection itself lives as a resource-level `auth()` check inside
// each protected page (src/app/favorites/page.tsx, src/app/suggest/page.tsx)
// rather than path matching here — Clerk deprecated `createRouteMatcher`-
// based middleware gating in favor of this pattern, since path matching can
// diverge from how Next.js actually routes a request. This proxy only
// establishes Clerk's request context.
export default clerkMiddleware();

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
