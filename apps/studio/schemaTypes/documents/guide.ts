import { BookIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";
import { isUniqueSlug } from "../../utils/validation";
import { seoField } from "../objects/seo";

export const guide = defineType({
  name: "guide",
  title: "Guide",
  type: "document",
  icon: BookIcon,
  description:
    "Evergreen how-to content for seniors and caregivers. Use steps for structured instructions (enables HowTo rich results).",
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
      description: "Short summary for listings and search.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [{ type: "howToStep" }],
      description: "Optional structured steps — used for HowTo schema markup.",
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
      name: "lastUpdated",
      title: "Last Updated",
      type: "date",
      description: "When this guide was last reviewed for accuracy.",
      validation: (rule) => rule.required(),
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
      title: "Last Updated, New",
      name: "lastUpdatedDesc",
      by: [{ field: "lastUpdated", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      updated: "lastUpdated",
      media: "mainImage",
    },
    prepare({ title, author, updated, media }) {
      const subtitle = [author, updated ? `Updated ${updated}` : undefined]
        .filter(Boolean)
        .join(" · ");
      return { title, subtitle, media };
    },
  },
});
