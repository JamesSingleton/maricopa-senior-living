import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineArrayMember, defineField, defineType } from "sanity";

import { createSlug, isUnique } from "../../utils/slug";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  icon: DocumentTextIcon,
  groups: [
    { name: "content", title: "Content", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        slugify: createSlug,
        maxLength: 96,
        isUnique,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "content",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      group: "content",
      description: "Short summary for cards and SEO fallback.",
      validation: (rule) => rule.max(280).warning("Keep under 280 characters"),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "portableText",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "content",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "category" }] }),
      ],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      group: "content",
      of: [defineArrayMember({ type: "reference", to: [{ type: "tag" }] })],
    }),
    defineField({
      name: "isArchived",
      title: "Archive article?",
      type: "boolean",
      group: "content",
      description: "Archived articles will not be shown on the front-end.",
      initialValue: false,
    }),
    defineField({
      name: "legacyPostId",
      title: "Legacy post ID",
      type: "string",
      group: "content",
      readOnly: true,
      hidden: ({ value }) => !value,
      description: "Source post document ID from migration. Do not edit.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
    }),
  ],
  orderings: [
    {
      title: "Published date, newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      media: "image",
      publishedAt: "publishedAt",
      isArchived: "isArchived",
    },
    prepare({ title, author, media, publishedAt, isArchived }) {
      const date = publishedAt
        ? new Date(publishedAt).toLocaleDateString()
        : undefined;
      const parts = [isArchived ? "Archived" : null, author, date].filter(
        Boolean,
      );
      return {
        title: title || "Untitled article",
        subtitle: parts.join(" · "),
        media,
      };
    },
  },
});
