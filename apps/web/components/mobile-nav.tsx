"use client";

import { Button } from "@maricopa-senior-living/ui/components/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@maricopa-senior-living/ui/components/collapsible";
import { ScrollArea } from "@maricopa-senior-living/ui/components/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@maricopa-senior-living/ui/components/sheet";
import { cn } from "@maricopa-senior-living/ui/lib/utils";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  flattenNavbarColumnLinks,
  type NavLink,
  type ResolvedNavbarItem,
  resolveNavbarHref,
} from "@/lib/navbar";

type MobileNavProps = {
  siteTitle?: string | null;
  items: ResolvedNavbarItem[];
  className?: string;
};

function MobileNavLogo({ siteTitle }: { siteTitle?: string | null }) {
  if (siteTitle) {
    return (
      <Link href="/" prefetch={false} className="text-lg font-semibold">
        {siteTitle}
      </Link>
    );
  }

  return (
    <Link href="/" prefetch={false} className="text-lg font-semibold">
      Maricopa Senior Living
    </Link>
  );
}

function MobileNavLink({
  link,
  className,
}: {
  link: NavLink;
  className?: string;
}) {
  const { href, isExternal, openInNewTab } = resolveNavbarHref(
    link.href,
    link.openInNewTab,
  );

  if (isExternal || openInNewTab) {
    return (
      <SheetClose
        nativeButton={false}
        render={
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "py-2 font-medium transition-colors hover:text-foreground/80",
              className,
            )}
          />
        }
      >
        {link.label}
      </SheetClose>
    );
  }

  return (
    <SheetClose
      nativeButton={false}
      render={
        <Link
          href={href}
          prefetch={false}
          className={cn(
            "py-2 font-medium transition-colors hover:text-foreground/80",
            className,
          )}
        />
      }
    >
      {link.label}
    </SheetClose>
  );
}

export function MobileNav({ siteTitle, items, className }: MobileNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname, searchParams]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className={cn("md:hidden", className)}
            aria-label="Open menu"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex min-w-80 flex-col gap-0 p-0 sm:max-w-sm"
      >
        <SheetHeader className="shrink-0 flex-row items-center justify-between gap-4 border-b px-6 py-4">
          <SheetTitle className="text-left font-medium">
            <MobileNavLogo siteTitle={siteTitle} />
          </SheetTitle>
          <SheetClose
            render={
              <Button variant="ghost" size="icon" aria-label="Close menu" />
            }
          >
            <X />
          </SheetClose>
        </SheetHeader>

        <ScrollArea className="min-h-0 flex-1">
          <div className="flex flex-col px-6 py-4">
            <nav aria-label="Mobile navigation" className="flex flex-col">
              {items.map((item) => {
                if (item.type === "link") {
                  return <MobileNavLink key={item._key} link={item} />;
                }

                const columnLinks = flattenNavbarColumnLinks(item);

                return (
                  <Collapsible key={item._key} className="group/collapsible">
                    <CollapsibleTrigger className="flex w-full items-center justify-between py-2 font-medium transition-colors hover:text-foreground/80">
                      {item.title}
                      <ChevronDown className="size-4 transition-transform duration-200 group-data-open/collapsible:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="flex flex-col pb-2">
                      {columnLinks.map((link) => (
                        <MobileNavLink
                          key={`${item._key}-${link.href}`}
                          link={link}
                          className="text-sm font-normal text-muted-foreground hover:text-foreground"
                        />
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </nav>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
