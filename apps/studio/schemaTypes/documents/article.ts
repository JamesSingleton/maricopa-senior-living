import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";

import { howToField } from "../../components/HowTo";
import { slugField } from "../../utils/slug";
import { needsReviewField, summaryField, topicsField } from "../shared";

export const ARTICLE_SERIES = [
  { title: "None", value: "none" },
  { title: "Joan's Corner", value: "joans-corner" },
  { title: "Ron's Ramblings", value: "rons-ramblings" },
];

/** Original writing by Ron, Joan or other local writers. */
export const article = defineType({
  name: "article",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    howToField("howTo", [
      "Articles are things written for this website — by Ron, Joan, or another local writer.",
      "Found a good article on another website? Add it as a Helpful link instead of copying it here.",
    ]),
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    slugField({ prefix: "/articles" }),
    defineField({
      name: "author",
      title: "Writer",
      type: "reference",
      to: [{ type: "author" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Date",
      type: "date",
      initialValue: () => new Date().toISOString().slice(0, 10),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "series",
      type: "string",
      initialValue: "none",
      options: { list: ARTICLE_SERIES, layout: "radio" },
    }),
    summaryField(),
    topicsField({ min: 1, max: 3 }),
    defineField({
      name: "mainImage",
      title: "Main picture",
      type: "imageWithAlt",
    }),
    defineField({
      name: "body",
      title: "Article",
      type: "richText",
      validation: (rule) => rule.required(),
    }),
    needsReviewField,
    defineField({
      name: "legacyId",
      type: "string",
      readOnly: true,
      hidden: true,
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "newest",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      date: "publishedAt",
      media: "mainImage",
    },
    prepare: ({ title, author, date, media }) => ({
      title,
      subtitle: [author, date].filter(Boolean).join(" · "),
      media,
    }),
  },
});
