import Link from "next/link";
import { HeartPulse, Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { QuickSearchForm } from "@/components/search/quick-search-form";
import { PrimaryNavLinks } from "@/components/layout/primary-nav-links";
import { DIRECTORY_NAV_ITEMS, UTILITY_NAV_ITEMS } from "@/lib/constants/nav";
import { SITE_NAME } from "@/lib/constants/site";

export function SiteHeader() {
  return (
    <header className="border-border bg-background/85 supports-[backdrop-filter]:bg-background/70 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-4 sm:px-6">
        <Link
          href="/"
          aria-label={SITE_NAME}
          className="focus-visible:ring-ring/50 flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:ring-3 focus-visible:outline-none"
        >
          <span className="from-primary text-primary-foreground shadow-primary/30 flex size-9 items-center justify-center rounded-xl bg-gradient-to-br to-blue-700 shadow-sm dark:to-blue-900">
            <HeartPulse className="size-5" aria-hidden="true" />
          </span>
          <span className="text-foreground hidden text-sm leading-tight font-semibold tracking-tight sm:inline sm:text-base">
            {SITE_NAME}
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="font-medium">
                Directory
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72">
              {DIRECTORY_NAV_ITEMS.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href} className="gap-2.5">
                    <item.icon
                      className="text-primary size-4"
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <PrimaryNavLinks
            items={UTILITY_NAV_ITEMS.map(({ label, href }) => ({
              label,
              href,
            }))}
          />
        </nav>

        <QuickSearchForm compact className="hidden md:flex md:w-48 lg:w-64" />

        <div className="flex items-center gap-1">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[min(22rem,100vw)] flex-col gap-0 p-0"
            >
              <SheetHeader className="border-border border-b pb-4">
                <SheetTitle className="flex items-center gap-2.5 text-left">
                  <span className="from-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg bg-gradient-to-br to-blue-700 dark:to-blue-900">
                    <HeartPulse className="size-4" aria-hidden="true" />
                  </span>
                  {SITE_NAME}
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-4 py-4">
                <p className="text-muted-foreground mb-2 px-1 text-xs font-semibold tracking-wide uppercase">
                  Directory
                </p>
                <nav
                  aria-label="Directory"
                  className="grid grid-cols-2 gap-1.5"
                >
                  {DIRECTORY_NAV_ITEMS.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="border-border hover:border-primary/40 hover:bg-accent focus-visible:ring-ring/50 flex flex-col items-start gap-1.5 rounded-lg border p-3 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:outline-none"
                      >
                        <item.icon
                          className="text-primary size-4.5"
                          aria-hidden="true"
                        />
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>

                <p className="text-muted-foreground mt-6 mb-2 px-1 text-xs font-semibold tracking-wide uppercase">
                  Explore
                </p>
                <nav aria-label="Explore" className="flex flex-col gap-0.5">
                  {UTILITY_NAV_ITEMS.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className="hover:bg-accent focus-visible:ring-ring/50 flex items-center gap-3 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-colors focus-visible:ring-3 focus-visible:outline-none"
                      >
                        <item.icon
                          className="text-muted-foreground size-4.5"
                          aria-hidden="true"
                        />
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                </nav>
              </div>

              <Separator />
              <div className="text-muted-foreground flex items-start gap-2.5 px-4 py-4 text-xs">
                <Phone
                  className="text-primary mt-0.5 size-4 shrink-0"
                  aria-hidden="true"
                />
                <p>
                  Medical emergency? Call{" "}
                  <strong className="text-foreground">999</strong>. For
                  non-emergency NHS advice, call{" "}
                  <strong className="text-foreground">111</strong> or visit{" "}
                  <a
                    href="https://111.nhs.uk"
                    className="text-primary hover:underline"
                  >
                    111.nhs.uk
                  </a>
                  .
                </p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="border-border border-t px-4 py-2 md:hidden">
        <QuickSearchForm compact />
      </div>
    </header>
  );
}
