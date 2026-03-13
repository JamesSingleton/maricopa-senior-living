import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  type: "document",
  title: "Page",
  description: "Pages are used for static content like Disclaimers and About.",
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      validation: (rule) => rule.required(),
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
    }),
    defineField({
      name: "body",
      type: "blockContent",
      title: "Body",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
