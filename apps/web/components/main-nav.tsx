"use client";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@maricopa-senior-living/ui/components/navigation-menu";
import { cn } from "@maricopa-senior-living/ui/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import {
  type NavLink,
  type ResolvedNavbarItem,
  resolveNavbarHref,
  splitLinksIntoColumns,
} from "@/lib/navbar";

type MainNavProps = {
  navItems: ResolvedNavbarItem[];
  className?: string;
};

function megaMenuGridClass(columnCount: number) {
  if (columnCount >= 6) {
    return "grid-cols-6";
  }
  if (columnCount === 5) {
    return "grid-cols-5";
  }
  if (columnCount >= 4) {
    return "grid-cols-4";
  }
  if (columnCount === 3) {
    return "grid-cols-3";
  }
  if (columnCount === 2) {
    return "grid-cols-2";
  }
  return "grid-cols-1";
}

function MegaMenuPanel({
  links,
  itemKey,
}: {
  links: NavLink[];
  itemKey: string;
}) {
  const columns = splitLinksIntoColumns(links, 5);

  return (
    <div className="w-screen max-w-none bg-background">
      <div className="container px-4 py-8 md:px-6 lg:px-8">
        <div
          className={cn(
            "grid justify-items-start gap-8",
            megaMenuGridClass(columns.length),
          )}
        >
          {columns.map((columnLinks, columnIndex) => (
            <MegaMenuSection
              key={`${itemKey}-col-${columnIndex}`}
              sectionKey={`${itemKey}-col-${columnIndex}`}
              title=""
              links={columnLinks}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function MegaMenuLink({ link }: { link: NavLink }) {
  const { href, isExternal, openInNewTab } = resolveNavbarHref(
    link.href,
    link.openInNewTab,
  );

  const linkClassName =
    "group/link flex w-full flex-col items-start gap-1 rounded-md p-2.5 text-left transition-colors hover:bg-muted/80";

  const content = (
    <>
      <span className="flex w-full items-start gap-1 text-left font-medium">
        <span className="flex-1">{link.label}</span>
        <ArrowRight
          aria-hidden
          className="mt-1 size-3 shrink-0 -translate-x-1 opacity-0 transition-all group-hover/link:translate-x-0 group-hover/link:opacity-100"
        />
      </span>
      {link.description ? (
        <span className="text-xs leading-relaxed text-muted-foreground">
          {link.description}
        </span>
      ) : null}
    </>
  );

  if (isExternal || openInNewTab) {
    return (
      <NavigationMenuLink
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {content}
      </NavigationMenuLink>
    );
  }

  return (
    <NavigationMenuLink
      render={<Link href={href} prefetch={false} />}
      className={linkClassName}
    >
      {content}
    </NavigationMenuLink>
  );
}

function MegaMenuSection({
  title,
  links,
  sectionKey,
}: {
  title: string;
  links: NavLink[];
  sectionKey: string;
}) {
  return (
    <div className="flex flex-col items-start gap-4 text-left">
      {title ? (
        <p className="h-5 text-xs font-normal tracking-wide text-muted-foreground">
          {title}
        </p>
      ) : null}
      {title ? <div className="h-px bg-border/20" /> : null}
      <div className="flex w-full flex-col items-start gap-1">
        {links.map((link) => (
          <MegaMenuLink key={`${sectionKey}-${link.href}`} link={link} />
        ))}
      </div>
    </div>
  );
}

function TopLevelNavLink({
  label,
  href,
  openInNewTab,
}: {
  label: string;
  href: string;
  openInNewTab: boolean;
}) {
  const resolved = resolveNavbarHref(href, openInNewTab);

  if (resolved.isExternal || resolved.openInNewTab) {
    return (
      <NavigationMenuLink
        href={resolved.href}
        target="_blank"
        rel="noopener noreferrer"
        className={navigationMenuTriggerStyle()}
      >
        {label}
      </NavigationMenuLink>
    );
  }

  return (
    <NavigationMenuLink
      render={<Link href={resolved.href} prefetch={false} />}
      className={navigationMenuTriggerStyle()}
    >
      {label}
    </NavigationMenuLink>
  );
}

export function MainNav({ navItems, className }: MainNavProps) {
  if (navItems.length === 0) {
    return null;
  }

  return (
    <NavigationMenu
      align="start"
      className={cn(
        "relative max-w-none flex-1 justify-start",
        "**:data-[slot=navigation-menu-positioner]:left-0 **:data-[slot=navigation-menu-positioner]:w-full **:data-[slot=navigation-menu-positioner]:justify-start",
        className,
      )}
    >
      <NavigationMenuList className="justify-start gap-1">
        {navItems.map((item) => {
          if (item.type === "link") {
            return (
              <NavigationMenuItem key={item._key}>
                <TopLevelNavLink
                  label={item.label}
                  href={item.href}
                  openInNewTab={item.openInNewTab}
                />
              </NavigationMenuItem>
            );
          }

          return (
            <NavigationMenuItem key={item._key}>
              <NavigationMenuTrigger className="h-11 px-4 text-base">
                {item.title}
              </NavigationMenuTrigger>
              <NavigationMenuContent className="rounded-none border-x-0 border-t border-dashed bg-background p-0 shadow-none">
                <MegaMenuPanel
                  itemKey={item._key}
                  links={item.sections.flatMap((section) => section.links)}
                />
              </NavigationMenuContent>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
