import { defineField } from "sanity";

export const seoFields = [
  defineField({
    name: "seoTitle",
    title: "SEO Title",
    type: "string",
    description: "Optional title override for search engines and browser tabs.",
    group: "seo",
  }),
  defineField({
    name: "seoDescription",
    title: "SEO Description",
    type: "text",
    rows: 3,
    description: "Optional description for search engine results.",
    group: "seo",
  }),
  defineField({
    name: "seoImage",
    title: "SEO Image",
    type: "image",
    description: "Optional image for social sharing and search previews.",
    options: { hotspot: true },
    group: "seo",
  }),
  defineField({
    name: "seoHideFromLists",
    title: "Hide from Lists",
    type: "boolean",
    description:
      "When enabled, this item will not appear in blog lists or search results.",
    initialValue: false,
    group: "seo",
  }),
];

export const seoGroup = {
  name: "seo",
  title: "SEO",
};
