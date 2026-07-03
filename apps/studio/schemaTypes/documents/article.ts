import { DocumentTextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { isUniqueSlug } from "../../utils/validation";
import { seoField } from "../objects/seo";

export const article = defineType({
  name: "article",
  title: "Article",
  type: "document",
  icon: DocumentTextIcon,
  description:
    "News, announcements, and syndicated content. For evergreen how-tos, use a Guide instead.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return "Slug is required";
          const unique = await isUniqueSlug(slug.current, context);
          return unique || "Slug is already in use";
        }),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary for listings and social sharing.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
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
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contentSource",
      title: "Content Source",
      type: "string",
      options: {
        list: [
          { title: "Original", value: "original" },
          { title: "Syndicated", value: "syndicated" },
        ],
        layout: "radio",
      },
      initialValue: "original",
    }),
    defineField({
      name: "syndication",
      title: "Syndication Details",
      type: "syndication",
      hidden: ({ parent }) => parent?.contentSource !== "syndicated",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "tag" }],
          options: { disableNew: true },
        },
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
    seoField,
  ],
  orderings: [
    {
      title: "Published Date, New",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      date: "publishedAt",
      media: "mainImage",
      source: "contentSource",
    },
    prepare({ title, author, date, media, source }) {
      const subtitle = [
        author,
        date ? new Date(date).toLocaleDateString() : undefined,
        source === "syndicated" ? "Syndicated" : undefined,
      ]
        .filter(Boolean)
        .join(" · ");
      return { title, subtitle, media };
    },
  },
});
