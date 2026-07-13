import { TextIcon } from "@sanity/icons/Text";
import { defineField, defineType } from "sanity";

export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "object",
  icon: TextIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section title",
      type: "string",
      description: "Optional heading shown above the rich text.",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "portableText",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return {
        title: title || "Rich text",
        subtitle: "Rich text",
        media: TextIcon,
      };
    },
  },
});
