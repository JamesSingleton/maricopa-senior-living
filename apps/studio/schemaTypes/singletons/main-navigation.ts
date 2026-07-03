import { MenuIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const mainNavigation = defineType({
  name: "mainNavigation",
  title: "Main Navigation",
  type: "document",
  icon: MenuIcon,
  description: "Header navigation links.",
  fields: [
    defineField({
      name: "title",
      title: "Internal Title",
      type: "string",
      initialValue: "Main Navigation",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "items",
      title: "Navigation Items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "navItem",
          fields: [
            defineField({
              name: "link",
              title: "Link",
              type: "link",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "children",
              title: "Dropdown Items",
              type: "array",
              of: [{ type: "link" }],
            }),
          ],
          preview: {
            select: { label: "link.label" },
            prepare({ label }) {
              return { title: label || "Nav Item" };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Main Navigation" };
    },
  },
});
