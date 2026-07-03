import { LinkIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

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
      title: "Link Type",
      type: "string",
      options: {
        list: [
          { title: "Internal", value: "internal" },
          { title: "External", value: "external" },
        ],
        layout: "radio",
      },
      initialValue: "internal",
    }),
    defineField({
      name: "internalReference",
      title: "Internal Page",
      type: "reference",
      to: [
        { type: "page" },
        { type: "article" },
        { type: "guide" },
        { type: "resource" },
        { type: "category" },
        { type: "tag" },
      ],
      hidden: ({ parent }) => parent?.linkType !== "internal",
    }),
    defineField({
      name: "externalUrl",
      title: "External URL",
      type: "url",
      hidden: ({ parent }) => parent?.linkType !== "external",
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
      label: "label",
      linkType: "linkType",
      externalUrl: "externalUrl",
      refTitle: "internalReference.title",
    },
    prepare({ label, linkType, externalUrl, refTitle }) {
      return {
        title: label || refTitle || "Link",
        subtitle:
          linkType === "external" ? externalUrl : refTitle ? `Internal: ${refTitle}` : "Internal",
      };
    },
  },
});
