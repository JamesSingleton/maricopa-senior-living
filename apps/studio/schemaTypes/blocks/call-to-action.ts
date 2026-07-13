import { BoltIcon } from "@sanity/icons/Bolt";
import { defineArrayMember, defineField, defineType } from "sanity";

export const callToAction = defineType({
  name: "callToAction",
  title: "Call to action",
  type: "object",
  icon: BoltIcon,
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Supporting text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "actions",
      title: "Actions",
      type: "array",
      of: [defineArrayMember({ type: "link" })],
      validation: (rule) => rule.min(1).max(2),
    }),
  ],
  preview: {
    select: { title: "headline" },
    prepare({ title }) {
      return {
        title: title || "Untitled CTA",
        subtitle: "Call to action",
        media: BoltIcon,
      };
    },
  },
});
