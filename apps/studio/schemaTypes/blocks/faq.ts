import { HelpCircleIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

const faqItem = defineField({
  name: "faqItem",
  type: "object",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "question" },
  },
});

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "object",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "title",
      title: "Section Title",
      type: "string",
    }),
    defineField({
      name: "items",
      title: "Questions",
      type: "array",
      of: [faqItem],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "title", items: "items" },
    prepare({ title, items = [] }) {
      return {
        title: title || "FAQ",
        subtitle: `FAQ • ${items.length} question${items.length === 1 ? "" : "s"}`,
        media: HelpCircleIcon,
      };
    },
  },
});
