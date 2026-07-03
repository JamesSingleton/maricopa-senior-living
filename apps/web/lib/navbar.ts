import {
  ArrowLeftRight,
  BarChart3,
  BookOpen,
  CloudUpload,
  LayoutGrid,
  type LucideIcon,
  Search,
  Store,
  Zap,
} from "lucide-react";

type NavbarLinkField = {
  _key: string;
  name: string | null;
  icon?: string | null;
  description: string | null;
  openInNewTab: boolean | null;
  href: string | null;
};

type NavbarColumnItemData = {
  _key: string;
  type: "column";
  title: string | null;
  links: NavbarLinkField[] | null;
};

type NavbarMegaMenuItemData = {
  _key: string;
  type: "mega";
  title: string | null;
  columns: Array<{
    _key: string;
    title: string | null;
    links: NavbarLinkField[] | null;
  }> | null;
};

type NavbarTopLevelLinkData = {
  _key: string;
  type: "link";
  name: string | null;
  description: string | null;
  openInNewTab: boolean | null;
  href: string | null;
};

type NavbarQueryColumn =
  | NavbarColumnItemData
  | NavbarMegaMenuItemData
  | NavbarTopLevelLinkData;

export type NavbarData = {
  _id?: string;
  megaMenuTitle?: string | null;
  columns?: NavbarQueryColumn[] | null;
} | null;

type NavbarColumn = {
  _key: string;
  title: string | null;
  links: Array<{
    _key: string;
    name: string | null;
    icon: string | null;
    description: string | null;
    openInNewTab: boolean | null;
    href: string | null;
  }>;
};

export type NavbarColumnLink = NavbarColumn["links"][number];

export type NavbarMegaMenu = {
  type: "mega";
  _key: string;
  columns: NavbarColumn[];
  triggerTitle: string;
};

export type NavLink = {
  label: string;
  href: string;
  description?: string | null;
  openInNewTab: boolean;
};

export type ResolvedNavbarLink = NavLink & {
  type: "link";
  _key: string;
};

export type ResolvedNavbarSection = {
  _key: string;
  groupLabel: string | null;
  links: NavLink[];
};

export type ResolvedNavbarMega = {
  type: "mega";
  _key: string;
  title: string;
  sections: ResolvedNavbarSection[];
};

export type ResolvedNavbarItem = ResolvedNavbarLink | ResolvedNavbarMega;

export type NavbarTopLevelLink = {
  type: "link";
  link: NavbarTopLevelLinkData;
};

export type OrderedNavbarItem = NavbarMegaMenu | NavbarTopLevelLink;

const iconByKeyword: Record<string, LucideIcon> = {
  backup: CloudUpload,
  guide: BookOpen,
  guides: BookOpen,
  analytics: BarChart3,
  marketplace: Store,
  api: ArrowLeftRight,
  integration: ArrowLeftRight,
  scale: LayoutGrid,
  scalability: LayoutGrid,
  automation: Zap,
  discovery: Search,
  support: BookOpen,
};

export function resolveNavbarHref(
  href: string | null,
  openInNewTab: boolean | null,
) {
  if (!href) {
    return { href: "#", isExternal: false, openInNewTab: false };
  }

  const isExternal =
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    Boolean(openInNewTab);

  const resolvedHref =
    isExternal || href.startsWith("/") ? href : `/${href}`;

  return {
    href: resolvedHref,
    isExternal,
    openInNewTab: openInNewTab ?? isExternal,
  };
}

export function getNavbarIcon(
  icon: string | null | undefined,
  label: string | null | undefined,
): LucideIcon {
  if (icon && icon in iconByKeyword) {
    return iconByKeyword[icon]!;
  }

  const normalized = (label ?? "").toLowerCase();
  for (const [keyword, Icon] of Object.entries(iconByKeyword)) {
    if (normalized.includes(keyword)) {
      return Icon;
    }
  }

  return BookOpen;
}

function toNavbarColumnLinks(
  links: NavbarLinkField[] | null | undefined,
): NavbarColumn["links"] {
  return (links ?? []).map((link) => ({
    _key: link._key,
    name: link.name,
    icon: link.icon ?? null,
    description: link.description,
    openInNewTab: link.openInNewTab,
    href: link.href,
  }));
}

function normalizeMegaColumns(
  columns: NavbarMegaMenuItemData["columns"],
): NavbarColumn[] {
  return (columns ?? []).map((column) => ({
    _key: column._key,
    title: column.title,
    links: toNavbarColumnLinks(column.links),
  }));
}

export function partitionNavbarItems(
  columns: NavbarQueryColumn[] | null | undefined,
  megaMenuTitle?: string | null,
): OrderedNavbarItem[] {
  if (!columns?.length) {
    return [];
  }

  const orderedItems: OrderedNavbarItem[] = [];
  let legacyMegaGroup: NavbarColumn[] = [];
  const legacyTrigger = megaMenuTitle?.trim() || "Explore";

  const flushLegacyMegaGroup = () => {
    for (const column of legacyMegaGroup) {
      orderedItems.push({
        type: "mega",
        _key: column._key,
        columns: [column],
        triggerTitle: column.title?.trim() || legacyTrigger,
      });
    }
    legacyMegaGroup = [];
  };

  for (const item of columns) {
    if (item.type === "mega") {
      flushLegacyMegaGroup();
      for (const column of normalizeMegaColumns(item.columns)) {
        orderedItems.push({
          type: "mega",
          _key: column._key,
          columns: [column],
          triggerTitle:
            column.title?.trim() || item.title?.trim() || legacyTrigger,
        });
      }
      continue;
    }

    if (item.type === "column") {
      legacyMegaGroup.push({
        _key: item._key,
        title: item.title,
        links: toNavbarColumnLinks(item.links),
      });
      continue;
    }

    flushLegacyMegaGroup();
    orderedItems.push({ type: "link", link: item });
  }

  flushLegacyMegaGroup();
  return orderedItems;
}

export function isFeaturedColumn(
  column: NavbarColumn,
  columnIndex: number,
  columns: NavbarColumn[],
) {
  const normalizedTitle = column.title?.toLowerCase();
  return (
    normalizedTitle === "more" ||
    normalizedTitle === "change log" ||
    (columnIndex === columns.length - 1 &&
      column.links.length === 1 &&
      Boolean(column.title))
  );
}

function toNavLink(link: NavbarColumn["links"][number]): NavLink {
  const { href, openInNewTab } = resolveNavbarHref(
    link.href,
    link.openInNewTab,
  );

  return {
    label: link.name?.trim() || "Link",
    href,
    description: link.description,
    openInNewTab,
  };
}

export function resolveNavbarItems(
  data: NavbarData | null | undefined,
): ResolvedNavbarItem[] {
  const orderedItems = partitionNavbarItems(
    data?.columns ?? null,
    data?.megaMenuTitle,
  );

  return orderedItems.map((item) => {
    if (item.type === "link") {
      const { href, openInNewTab } = resolveNavbarHref(
        item.link.href,
        item.link.openInNewTab,
      );

      return {
        type: "link",
        _key: item.link._key,
        label: item.link.name?.trim() || "Link",
        href,
        description: item.link.description,
        openInNewTab,
      };
    }

    return {
      type: "mega",
      _key: item._key,
      title: item.triggerTitle,
      sections: item.columns.map((column) => ({
        _key: column._key,
        groupLabel: item.columns.length > 1 ? column.title : null,
        links: column.links.map(toNavLink),
      })),
    };
  });
}

export function flattenNavbarColumnLinks(item: ResolvedNavbarMega): NavLink[] {
  return item.sections.flatMap((section) => section.links);
}

export function splitLinksIntoColumns(
  links: NavLink[],
  maxPerColumn = 5,
): NavLink[][] {
  if (links.length === 0) {
    return [];
  }

  const columns: NavLink[][] = [];
  for (let index = 0; index < links.length; index += maxPerColumn) {
    columns.push(links.slice(index, index + maxPerColumn));
  }

  return columns;
}
