import { ControlsIcon } from "@sanity/icons/Controls";
import { defineArrayMember, defineField, defineType } from "sanity";

export const categoryBrowse = defineType({
  name: "categoryBrowse",
  title: "Category browse",
  type: "object",
  icon: ControlsIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      initialValue: "Browse by topic",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "category" }] }),
      ],
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: { title: "headline", categories: "categories" },
    prepare({ title, categories }) {
      const count = Array.isArray(categories) ? categories.length : 0;
      return {
        title: title || "Browse by topic",
        subtitle: `Category browse · ${count} categor${count === 1 ? "y" : "ies"}`,
        media: ControlsIcon,
      };
    },
  },
});
