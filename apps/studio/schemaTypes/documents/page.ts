import { DocumentIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { pageBuilderField } from "../definitions/page-builder";
import { seoFields, seoGroup, slugField } from "../shared";

export const page = defineType({
  name: "page",
  type: "document",
  title: "Info Page",
  icon: DocumentIcon,
  description: "Pages for static content like About, Contact, and Disclaimers.",
  groups: [{ name: "content", title: "Content", default: true }, seoGroup],
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    { ...slugField({ source: "title" }), group: "content" },
    { ...pageBuilderField, group: "content" },
    ...seoFields,
  ],
  preview: {
    select: {
      title: "title",
    },
  },
});
