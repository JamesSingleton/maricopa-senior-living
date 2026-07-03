import type { NavLink, ResolvedNavbarItem } from "@/lib/navbar";

export type HeaderNavLink = {
  url?: string | null;
  text?: string | null;
  reference?: {
    _id: string;
    _type: string;
    title: string;
    slug: string;
  } | null;
};

export type HeaderNavChild = {
  _key: string;
  link: HeaderNavLink;
};

export type HeaderNavItem = {
  _key: string;
  link: HeaderNavLink;
  children?: HeaderNavChild[] | null;
};

export function getHeaderNavLabel(link: HeaderNavLink) {
  return link.text ?? link.reference?.title ?? "Link";
}

export function resolveHeaderNavHref(link: HeaderNavLink) {
  if (link.reference?.slug) {
    const prefix =
      link.reference._type === "page" ? "" : `/${link.reference._type}`;

    return {
      href: `${prefix}/${link.reference.slug}`,
      isExternal: false,
      openInNewTab: false,
    };
  }

  if (link.url) {
    return {
      href: link.url,
      isExternal: true,
      openInNewTab: true,
    };
  }

  return {
    href: "#",
    isExternal: false,
    openInNewTab: false,
  };
}

export function isHeaderNavDropdown(item: HeaderNavItem) {
  return !item.link.reference;
}

export function splitHeaderNavChildrenIntoColumns(
  children: HeaderNavChild[],
  maxColumns = 4,
) {
  if (children.length === 0) {
    return [];
  }

  const columnCount = Math.min(
    maxColumns,
    Math.max(1, Math.ceil(children.length / 3)),
  );
  const chunkSize = Math.ceil(children.length / columnCount);
  const columns: HeaderNavChild[][] = [];

  for (let index = 0; index < children.length; index += chunkSize) {
    columns.push(children.slice(index, index + chunkSize));
  }

  return columns;
}

export function shouldUseFeaturedColumn(
  columns: HeaderNavChild[][],
  columnIndex: number,
) {
  return columns.length > 1 && columnIndex === columns.length - 1;
}

function toNavLink(link: HeaderNavLink): NavLink {
  const { href, openInNewTab } = resolveHeaderNavHref(link);

  return {
    label: getHeaderNavLabel(link),
    href,
    openInNewTab,
  };
}

export function resolveHeaderNavItems(
  menu: HeaderNavItem[] | null | undefined,
): ResolvedNavbarItem[] {
  if (!menu?.length) {
    return [];
  }

  return menu.map((item) => {
    if (isHeaderNavDropdown(item)) {
      return {
        type: "mega",
        _key: item._key,
        title: getHeaderNavLabel(item.link),
        sections: [
          {
            _key: `${item._key}-section`,
            groupLabel: null,
            links: (item.children ?? []).map((child) => toNavLink(child.link)),
          },
        ],
      };
    }

    return {
      type: "link",
      _key: item._key,
      ...toNavLink(item.link),
    };
  });
}
