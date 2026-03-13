import { defineField, defineType } from "sanity";

import { createSlug, isUnique } from "../../utils/slug";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
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
        slugify: createSlug,
        maxLength: 96,
        isUnique: isUnique,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "blockContent",
      description:
        "This will get displayed under the title on the category page as well as the page's description (what shows up on Google Search Results).",

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
