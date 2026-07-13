import { HomeIcon } from "@sanity/icons/Home";
import { defineField, defineType } from "sanity";

export const homePage = defineType({
  name: "homePage",
  title: "Home",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      initialValue: "Home",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "pageBuilder",
      title: "Page builder",
      type: "pageBuilder",
      group: "content",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Home",
        subtitle: "Homepage",
        media: HomeIcon,
      };
    },
  },
});
