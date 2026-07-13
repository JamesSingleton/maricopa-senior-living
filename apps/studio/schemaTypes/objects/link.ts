import { LinkIcon } from "@sanity/icons/Link";
import { defineField, defineType } from "sanity";

import { createRadioListLayout, isValidUrl } from "../../utils/helper";

export const link = defineType({
  name: "link",
  title: "Link",
  type: "object",
  icon: LinkIcon,
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "linkType",
      title: "Link type",
      type: "string",
      options: createRadioListLayout(["internal", "external"]),
      initialValue: "internal",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "internalLink",
      title: "Internal link",
      type: "reference",
      to: [
        { type: "page" },
        { type: "article" },
        { type: "resource" },
        { type: "category" },
      ],
      hidden: ({ parent }) => parent?.linkType !== "internal",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { linkType?: string } | undefined;
          if (parent?.linkType === "internal" && !value) {
            return "Select a page, article, resource, or category";
          }
          return true;
        }),
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      hidden: ({ parent }) => parent?.linkType !== "external",
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as { linkType?: string } | undefined;
          if (parent?.linkType !== "external") return true;
          if (!value) return "Enter a URL";
          if (!isValidUrl(value)) return "Enter a valid URL";
          return true;
        }),
    }),
    defineField({
      name: "openInNewTab",
      title: "Open in new tab",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "label",
      linkType: "linkType",
      externalUrl: "externalUrl",
      internalTitle: "internalLink.title",
    },
    prepare({ title, linkType, externalUrl, internalTitle }) {
      return {
        title: title || "Untitled link",
        subtitle:
          linkType === "external"
            ? externalUrl || "External"
            : internalTitle || "Internal",
        media: LinkIcon,
      };
    },
  },
});
