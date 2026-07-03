"use client";

import Link from "next/link";

import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import type { ResolvedNavbarItem } from "@/lib/navbar";

type SiteHeaderProps = {
  navItems: ResolvedNavbarItem[];
  siteTitle?: string | null;
};

export function SiteHeader({ navItems, siteTitle }: SiteHeaderProps) {
  const title = siteTitle?.trim() || "Maricopa Senior Living";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background transition-all duration-300">
      <div className="container px-4 md:px-6 lg:px-8">
        <div className="flex h-fit w-full items-center justify-between gap-4 py-4">
          <div className="flex min-w-0 flex-1 items-center gap-6">
            <Link
              href="/"
              prefetch={false}
              className="shrink-0 text-lg font-semibold text-foreground md:text-xl"
            >
              {title}
            </Link>

            <MainNav navItems={navItems} className="hidden md:flex" />
          </div>

          <MobileNav siteTitle={title} items={navItems} />
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
