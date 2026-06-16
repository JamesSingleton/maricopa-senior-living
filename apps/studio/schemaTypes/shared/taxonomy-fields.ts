import { defineField } from "sanity";

export const taxonomyFields = [
  defineField({
    name: "categories",
    title: "Categories",
    type: "array",
    of: [{ type: "reference", to: [{ type: "category" }] }],
    description: "Group this content under one or more categories.",
  }),
  defineField({
    name: "tags",
    title: "Tags",
    type: "array",
    of: [{ type: "reference", to: [{ type: "tag" }] }],
    description:
      "Add optional tags to help people filter and find this content.",
  }),
];

export const requiredCategoriesField = defineField({
  name: "categories",
  title: "Categories",
  type: "array",
  of: [{ type: "reference", to: [{ type: "category" }] }],
  validation: (rule) => rule.required().min(1),
});
