import { defineField, defineType } from "sanity";

export const howToStep = defineType({
  name: "howToStep",
  title: "Step",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Step Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Step Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Step" };
    },
  },
});
