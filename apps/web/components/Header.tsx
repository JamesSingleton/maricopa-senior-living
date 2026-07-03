"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { CmsLink, type CmsLinkData } from "@/components/CmsLink";
import { Button } from "@maricopa-senior-living/ui/components/button";

export interface NavItem {
  _key: string;
  link?: CmsLinkData | null;
  children?: CmsLinkData[] | null;
}

export default function Header({
  menu,
  siteTitle = "Maricopa Senior Resource Hub",
}: {
  menu: NavItem[];
  siteTitle?: string;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-tight text-foreground"
          prefetch={false}
        >
          {siteTitle}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {menu.map((item) => {
            const children = item.children?.filter((c) => c?.href) ?? [];
            if (children.length > 0) {
              return (
                <div key={item._key} className="group relative">
                  <span className="rounded-lg px-3 py-2 text-sm font-medium">
                    {item.link?.label ?? "Menu"}
                  </span>
                  <div className="invisible absolute left-0 top-full z-50 min-w-48 rounded-lg border border-border bg-popover p-2 opacity-0 shadow-lg transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    {children.map((child, i) => (
                      <CmsLink
                        key={`${item._key}-${i}`}
                        link={child}
                        className="block rounded-md px-3 py-2 text-sm hover:bg-muted"
                      />
                    ))}
                  </div>
                </div>
              );
            }
            if (!item.link?.href) return null;
            return (
              <CmsLink
                key={item._key}
                link={item.link}
                className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              />
            );
          })}
          <Link
            href="/search"
            className="rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
            prefetch={false}
          >
            Search
          </Link>
        </nav>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? "Close menu" : "Menu"}
        </Button>
      </div>

      {mobileOpen ? (
        <nav
          id="mobile-nav"
          className="border-t border-border bg-background px-4 py-4 lg:hidden"
          aria-label="Mobile"
        >
          <ul className="space-y-1">
            {menu.map((item) => (
              <li key={item._key}>
                {item.link?.href ? (
                  <CmsLink
                    link={item.link}
                    className="block rounded-md px-3 py-3 text-base font-medium hover:bg-muted"
                  />
                ) : null}
                {item.children?.map((child, i) =>
                  child?.href ? (
                    <CmsLink
                      key={`${item._key}-m-${i}`}
                      link={child}
                      className="block rounded-md py-2 pl-6 pr-3 text-sm text-muted-foreground hover:bg-muted"
                    />
                  ) : null,
                )}
              </li>
            ))}
            <li>
              <Link
                href="/search"
                className={`block rounded-md px-3 py-3 text-base font-medium hover:bg-muted ${pathname === "/search" ? "bg-muted" : ""}`}
                prefetch={false}
                onClick={() => setMobileOpen(false)}
              >
                Search
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
