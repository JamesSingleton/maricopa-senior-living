import { NumberIcon } from "@sanity/icons/Number";
import { defineArrayMember, defineField, defineType } from "sanity";

export const steps = defineType({
  name: "steps",
  title: "Steps",
  type: "object",
  icon: NumberIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "items",
      title: "Steps",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "step",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        }),
      ],
      validation: (rule) => rule.min(2),
    }),
  ],
  preview: {
    select: { title: "headline", items: "items" },
    prepare({ title, items }) {
      const count = Array.isArray(items) ? items.length : 0;
      return {
        title: title || "Steps",
        subtitle: `Steps · ${count} step${count === 1 ? "" : "s"}`,
        media: NumberIcon,
      };
    },
  },
});
