import { BlockElementIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const siteFooter = defineType({
  name: "siteFooter",
  title: "Site Footer",
  type: "document",
  icon: BlockElementIcon,
  description: "Footer content and link columns.",
  fields: [
    defineField({
      name: "title",
      title: "Internal Title",
      type: "string",
      initialValue: "Site Footer",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short description shown in the footer.",
    }),
    defineField({
      name: "columns",
      title: "Link Columns",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "footerColumn",
          fields: [
            defineField({
              name: "heading",
              title: "Column Heading",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [{ type: "link" }],
            }),
          ],
          preview: {
            select: { title: "heading" },
          },
        }),
      ],
    }),
    defineField({
      name: "copyright",
      title: "Copyright Text",
      type: "string",
      description: 'e.g. "© 2026 Maricopa Senior Resource Hub"',
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Footer" };
    },
  },
});
