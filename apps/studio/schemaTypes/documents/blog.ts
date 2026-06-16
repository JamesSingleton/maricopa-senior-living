import { DocumentTextIcon } from "@sanity/icons";
import {
  orderRankField,
  orderRankOrdering,
} from "@sanity/orderable-document-list";
import { defineArrayMember, defineField, defineType } from "sanity";

import { richTextField } from "../common";
import { pageBuilderField } from "../definitions/page-builder";
import { seoFields, seoGroup, slugField, taxonomyFields } from "../shared";

export const blog = defineType({
  name: "blog",
  title: "Blog Post",
  type: "document",
  icon: DocumentTextIcon,
  orderings: [orderRankOrdering],
  groups: [{ name: "content", title: "Content", default: true }, seoGroup],
  fields: [
    orderRankField({ type: "blog" }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    slugField({ source: "title" }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short summary shown on blog listing cards.",
    }),
    defineField({
      name: "image",
      title: "Featured Image",
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
        defineField({
          name: "caption",
          title: "Caption",
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "author" }] })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    ...taxonomyFields.map((field) => ({ ...field, group: "content" })),
    richTextField,
    { ...pageBuilderField, group: "content" },
    ...seoFields,
  ],
  preview: {
    select: {
      title: "title",
      author: "authors.0.name",
      media: "image",
    },
    prepare({ title, author, media }) {
      return {
        title,
        subtitle: author ? `by ${author}` : undefined,
        media,
      };
    },
  },
});
