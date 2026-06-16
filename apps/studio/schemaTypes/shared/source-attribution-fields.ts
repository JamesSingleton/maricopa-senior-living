import { defineField } from "sanity";

export const sourceAttributionFields = [
  defineField({
    name: "sourceName",
    title: "Source Name",
    type: "string",
    description: "The name of the original publisher (e.g. Arizona Republic).",
    fieldset: "source",
    validation: (rule) => rule.required(),
  }),
  defineField({
    name: "sourceUrl",
    title: "Source URL",
    type: "url",
    description: "Link to the original article or resource.",
    fieldset: "source",
    validation: (rule) => rule.required(),
  }),
];

export const sourceFieldset = {
  name: "source",
  title: "Source Attribution",
  options: { collapsible: true, collapsed: false },
};
