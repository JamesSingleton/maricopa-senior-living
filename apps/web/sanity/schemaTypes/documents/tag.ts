import { TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        slugify: (input) =>
          input
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .replace(/--+/g, "-"),
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      description:
        "This will get displayed under the title on the tag page as well as the page's description (what shows up on Google Search Results).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "highlight",
      title: "Highlight",
      type: "boolean",
      description:
        "If checked, this category will be highlighted on the right sidebar.",
      initialValue: false,
    }),
  ],
});
