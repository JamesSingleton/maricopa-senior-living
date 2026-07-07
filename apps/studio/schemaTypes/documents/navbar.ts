import { LayoutPanelLeft, Link, PanelTop } from "lucide-react";
import { defineField, defineType } from "sanity";

import { buttonsField } from "../common";

const navbarLink = defineField({
  name: "navbarLink",
  type: "object",
  icon: Link,
  title: "Navigation Link",
  description: "Individual navigation link with name and URL",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Link Text",
      description: "The text that will be displayed for this navigation link",
    }),
    defineField({
      name: "url",
      type: "customUrl",
      title: "Link URL",
      description: "The URL that this link will navigate to when clicked",
    }),
  ],
  preview: {
    select: {
      title: "name",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal.slug.current",
      openInNewTab: "url.openInNewTab",
    },
    prepare({ title, externalUrl, urlType, internalUrl, openInNewTab }) {
      const url = urlType === "external" ? externalUrl : internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl =
        url?.length > 30 ? `${url.substring(0, 30)}...` : url;

      return {
        title: title || "Untitled Link",
        subtitle: `${urlType === "external" ? "External" : "Internal"} • ${truncatedUrl}${newTabIndicator}`,
        media: Link,
      };
    },
  },
});

const navbarColumnLink = defineField({
  name: "navbarColumnLink",
  type: "object",
  icon: LayoutPanelLeft,
  title: "Navigation Column Link",
  description: "A link within a navigation column",
  fields: [
    defineField({
      name: "name",
      type: "string",
      title: "Link Text",
      description: "The text that will be displayed for this navigation link",
    }),
    defineField({
      name: "description",
      type: "string",
      title: "Description",
      description: "The description for this navigation link",
    }),
    defineField({
      name: "url",
      type: "customUrl",
      title: "Link URL",
      description: "The URL that this link will navigate to when clicked",
    }),
  ],
  preview: {
    select: {
      title: "name",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal.slug.current",
      openInNewTab: "url.openInNewTab",
    },
    prepare({ title, externalUrl, urlType, internalUrl, openInNewTab }) {
      const url = urlType === "external" ? externalUrl : internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl =
        url?.length > 30 ? `${url.substring(0, 30)}...` : url;

      return {
        title: title || "Untitled Link",
        subtitle: `${urlType === "external" ? "External" : "Internal"} • ${truncatedUrl}${newTabIndicator}`,
        media: Link,
      };
    },
  },
});

const navbarColumn = defineField({
  name: "navbarColumn",
  type: "object",
  icon: LayoutPanelLeft,
  title: "Navigation Column",
  description:
    "A column of links inside a mega menu. Prefer adding columns within a Mega Menu item.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Column Title",
      description: "Optional heading above this group of links (e.g. More)",
    }),
    defineField({
      name: "links",
      type: "array",
      title: "Column Links",
      validation: (rule) => [rule.required(), rule.unique()],
      description: "The list of navigation links to display in this column",
      of: [navbarColumnLink],
    }),
  ],
  preview: {
    select: {
      title: "title",
      links: "links",
    },
    prepare({ title, links = [] }) {
      return {
        title: title || "Untitled Column",
        subtitle: `${links.length} link${links.length === 1 ? "" : "s"}`,
      };
    },
  },
});

const navbarMegaMenu = defineField({
  name: "navbarMegaMenu",
  type: "object",
  icon: LayoutPanelLeft,
  title: "Mega Menu",
  description: "A dropdown menu with multiple columns of links (e.g. Features)",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Menu Label",
      description:
        "Top-level label shown in the navigation bar (e.g. Features)",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "columns",
      type: "array",
      title: "Menu Columns",
      description: "Columns displayed inside the dropdown panel",
      of: [navbarColumn],
    }),
  ],
  preview: {
    select: {
      title: "title",
      columns: "columns",
    },
    prepare({ title, columns = [] }) {
      return {
        title: title || "Untitled Mega Menu",
        subtitle: `${columns.length} column${columns.length === 1 ? "" : "s"}`,
      };
    },
  },
});

export const navbar = defineType({
  name: "navbar",
  title: "Site Navigation",
  type: "document",
  icon: PanelTop,
  description: "Configure the main navigation structure for your site",
  fields: [
    defineField({
      name: "label",
      type: "string",
      initialValue: "Navbar",
      title: "Navigation Label",
      description:
        "Internal label to identify this navigation configuration in the CMS",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "megaMenuTitle",
      type: "string",
      title: "Legacy Mega Menu Label",
      description:
        "Label for dropdown menus built from standalone columns (e.g. Features). Prefer using a Mega Menu item instead.",
    }),
    defineField({
      name: "columns",
      type: "array",
      title: "Navigation Structure",
      description:
        "Add mega menus for dropdown sections and navigation links for top-level items.",
      of: [navbarMegaMenu, navbarLink, navbarColumn],
    }),
    buttonsField,
  ],
  preview: {
    select: {
      title: "label",
    },
    prepare: ({ title }) => ({
      title: title || "Untitled Navigation",
    }),
  },
});
