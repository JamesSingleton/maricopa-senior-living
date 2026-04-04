"use client";

import { Button } from "@maricopa-senior-living/ui/components/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@maricopa-senior-living/ui/components/sheet";
import { cn } from "@maricopa-senior-living/ui/lib/utils";
import { ExternalLink, Menu, Phone, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/articles", label: "Articles" },
  { href: "/blog", label: "Blog" },
  { href: "/resources", label: "Resources" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/quick-links", label: "Community Links" },
  { href: "/about", label: "About" },
];

const QUICK_EXTERNAL = [
  { href: "https://www.maricopa-az.gov", label: "City of Maricopa" },
  { href: "https://www.inmaricopa.com", label: "InMaricopa News" },
  { href: "https://az511.gov", label: "SR 347 Traffic" },
  { href: "https://www.medicare.gov", label: "Medicare.gov" },
];

export default function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="w-full bg-background border-b border-border sticky top-0 z-50">
      {/* Utility bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-9 flex items-center justify-between gap-4">
          <p className="text-xs font-sans tracking-wide hidden sm:block truncate">
            A 501(c)(3) Non-Profit Organization Serving Maricopa, AZ
          </p>
          <p className="text-xs font-sans tracking-wide sm:hidden">
            501(c)(3) Non-Profit &mdash; Maricopa, AZ
          </p>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex flex-col leading-tight group shrink-0"
            aria-label="Maricopa Senior Living — Home"
          >
            <span className="font-serif font-bold text-xl lg:text-2xl text-primary group-hover:text-primary/80 transition-colors tracking-tight">
              Maricopa
            </span>
            <span className="font-sans font-semibold text-[11px] lg:text-xs text-muted-foreground uppercase tracking-[0.18em]">
              Senior Living
            </span>
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden lg:flex items-center gap-0.5 xl:gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-3 xl:px-3.5 py-2 rounded-md text-sm font-sans font-semibold transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted hover:text-primary",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/search"
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-md border border-border bg-secondary hover:bg-muted transition-colors text-sm font-sans font-medium text-foreground"
              aria-label="Search the site"
            >
              <Search
                className="w-4 h-4 text-secondary-foreground"
                aria-hidden="true"
              />
              <span className="hidden md:inline text-secondary-foreground">
                Search
              </span>
            </Link>

            <Link
              href="/newsletter"
              className="hidden lg:inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-sans font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
            >
              Subscribe
            </Link>

            {/* Mobile sheet trigger */}
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    className="lg:hidden flex items-center justify-center h-11 w-11 rounded-md border border-border bg-secondary hover:bg-muted transition-colors text-foreground"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="h-5 w-5" aria-hidden="true" />
                  </Button>
                }
              />

              <SheetContent
                side="left"
                className="w-[300px] sm:w-[340px] p-0 flex flex-col bg-background border-r border-border"
              >
                <SheetHeader className="px-5 pt-5 pb-4 shrink-0">
                  <SheetTitle className="flex flex-col leading-tight">
                    <span className="font-serif font-bold text-xl">
                      Maricopa
                    </span>
                    <span className="font-sans font-semibold text-xs uppercase tracking-[0.18em]">
                      Senior Living
                    </span>
                  </SheetTitle>
                  <SheetDescription className="text-[11px] text-muted-foreground mt-2.5 font-sans">
                    501(c)(3) Non-Profit &bull; Maricopa, AZ
                  </SheetDescription>
                </SheetHeader>
                {/* Sheet header */}

                {/* Sheet body */}
                <div className="flex-1 overflow-y-auto">
                  {/* Main nav links */}
                  <div className="py-3">
                    <p className="px-5 py-2 text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground">
                      Navigation
                    </p>
                    <nav aria-label="Mobile navigation">
                      {NAV_LINKS.map((link) => {
                        const isActive =
                          link.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(link.href);
                        return (
                          <SheetClose
                            key={link.href}
                            render={
                              <Link
                                href={link.href}
                                className={cn(
                                  "flex items-center px-5 py-3.5 text-base font-sans font-medium transition-colors border-l-[3px]",
                                  isActive
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-transparent text-foreground hover:bg-muted hover:border-border",
                                )}
                                aria-current={isActive ? "page" : undefined}
                              >
                                {link.label}
                              </Link>
                            }
                            nativeButton={false}
                          />
                        );
                      })}
                    </nav>
                  </div>

                  {/* Divider */}
                  <div className="mx-5 border-t border-border" />

                  {/* Quick external links */}
                  <div className="py-3">
                    <p className="px-5 py-2 text-[10px] font-sans font-bold uppercase tracking-widest text-muted-foreground">
                      Quick External Links
                    </p>
                    {QUICK_EXTERNAL.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between px-5 py-3.5 text-base font-sans font-medium text-foreground hover:bg-muted border-l-[3px] border-transparent hover:border-border transition-colors"
                      >
                        <span>{link.label}</span>
                        <ExternalLink
                          className="h-3.5 w-3.5 text-muted-foreground shrink-0"
                          aria-hidden="true"
                        />
                      </a>
                    ))}
                    <SheetClose
                      render={
                        <Link
                          href="/links"
                          className="flex items-center px-5 py-3 text-sm font-sans font-semibold text-primary hover:underline"
                        >
                          View all community links &rarr;
                        </Link>
                      }
                      nativeButton={false}
                    />
                  </div>
                </div>

                {/* Sheet footer */}
                <div className="border-t border-border px-5 py-4 bg-muted/40 shrink-0 space-y-2">
                  <SheetClose
                    render={
                      <Link
                        href="/newsletter"
                        className="flex items-center justify-center w-full bg-primary text-primary-foreground rounded-md py-3 text-sm font-sans font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Subscribe to Newsletter
                      </Link>
                    }
                    nativeButton={false}
                  />

                  <a
                    href="tel:+15205550100"
                    className="flex items-center justify-center gap-2 py-2 text-sm font-sans text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <span>(520) 555-0100</span>
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
