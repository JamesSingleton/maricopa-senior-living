import { defineField } from "sanity";

export const publishableFields = [
  defineField({
    name: "publishedAt",
    title: "Published At",
    type: "datetime",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "isArchived",
    title: "Archive?",
    type: "boolean",
    description: "Archived items will not be shown on the website.",
    initialValue: false,
  }),
];
