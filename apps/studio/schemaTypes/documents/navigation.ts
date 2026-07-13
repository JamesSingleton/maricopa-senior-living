import { MenuIcon } from "@sanity/icons/Menu";
import { defineArrayMember, defineField, defineType } from "sanity";

export const navigation = defineType({
  name: "navigation",
  title: "Navigation",
  type: "document",
  icon: MenuIcon,
  fields: [
    defineField({
      name: "main",
      title: "Main navigation",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "footer",
      title: "Footer navigation",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: "Navigation",
        media: MenuIcon,
      };
    },
  },
});
