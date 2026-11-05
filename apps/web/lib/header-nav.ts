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

/** Public URL prefix for each linkable document type. */
const REFERENCE_PATHS: Record<string, string> = {
  page: "",
  post: "/articles",
  category: "/category",
  tag: "/tag",
};

export function resolveHeaderNavHref(link: HeaderNavLink) {
  if (link.reference?.slug) {
    const prefix = REFERENCE_PATHS[link.reference._type] ?? "";
    const slug = link.reference.slug.replace(/^\//, "");

    return {
      href: `${prefix}/${slug}`,
      isExternal: false,
      openInNewTab: false,
    };
  }

  if (link.url) {
    // Only other websites open in a new tab; site paths, phone and email
    // links stay in place.
    const isExternal = /^https?:\/\//i.test(link.url);
    return {
      href: link.url,
      isExternal,
      openInNewTab: isExternal,
    };
  }

  return {
    href: "#",
    isExternal: false,
    openInNewTab: false,
  };
}

export function isHeaderNavDropdown(item: HeaderNavItem) {
  return Boolean(item.children?.length);
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
