import Link from "next/link";
import { HeartPulse, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { DIRECTORY_NAV_ITEMS, UTILITY_NAV_ITEMS } from "@/lib/constants/nav";
import { SITE_NAME } from "@/lib/constants/site";

export function SiteHeader() {
  return (
    <header className="border-border bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="focus-visible:ring-ring/50 flex items-center gap-2 rounded-md font-semibold tracking-tight focus-visible:ring-3 focus-visible:outline-none"
        >
          <HeartPulse className="text-primary size-5" aria-hidden="true" />
          <span className="text-sm sm:text-base">{SITE_NAME}</span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                Directory
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {DIRECTORY_NAV_ITEMS.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {UTILITY_NAV_ITEMS.map((item) => (
            <Button key={item.href} variant="ghost" size="sm" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

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
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle>{SITE_NAME}</SheetTitle>
            </SheetHeader>
            <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 pb-6">
              <p className="text-muted-foreground mt-2 mb-1 text-xs font-semibold tracking-wide uppercase">
                Directory
              </p>
              {DIRECTORY_NAV_ITEMS.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:bg-muted focus-visible:ring-ring/50 rounded-md px-2 py-2 text-sm focus-visible:ring-3 focus-visible:outline-none"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
              <p className="text-muted-foreground mt-4 mb-1 text-xs font-semibold tracking-wide uppercase">
                Explore
              </p>
              {UTILITY_NAV_ITEMS.map((item) => (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:bg-muted focus-visible:ring-ring/50 rounded-md px-2 py-2 text-sm focus-visible:ring-3 focus-visible:outline-none"
                  >
                    {item.label}
                  </Link>
                </SheetClose>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
