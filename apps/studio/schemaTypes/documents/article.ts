import { DocumentsIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import {
  publishableFields,
  requiredCategoriesField,
  seoFields,
  seoGroup,
  slugField,
  sourceAttributionFields,
  sourceFieldset,
} from "../shared";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  icon: DocumentsIcon,
  fieldsets: [sourceFieldset],
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "source", title: "Source" },
    seoGroup,
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    slugField({ source: "title" }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short summary for search results and listing cards.",
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    { ...requiredCategoriesField, group: "content" },
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "reference", to: [{ type: "tag" }] }],
      group: "content",
    }),
    ...publishableFields.map((field) => ({ ...field, group: "content" })),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    ...sourceAttributionFields.map((field) => ({ ...field, group: "source" })),
    ...seoFields,
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "mainImage",
      source: "sourceName",
    },
    prepare({ title, author, media, source }) {
      return {
        title,
        subtitle: [author && `by ${author}`, source && `from ${source}`]
          .filter(Boolean)
          .join(" • "),
        media,
      };
    },
  },
});
