import { defineField, defineType } from "sanity";

export const syndication = defineType({
  name: "syndication",
  title: "Syndication",
  type: "object",
  fields: [
    defineField({
      name: "originalPublication",
      title: "Original Publication",
      type: "string",
      description: 'e.g. "AARP Bulletin"',
    }),
    defineField({
      name: "originalUrl",
      title: "Original URL",
      type: "url",
      description: "Link to the original article — used for canonical SEO.",
    }),
    defineField({
      name: "originalAuthor",
      title: "Original Author",
      type: "string",
    }),
    defineField({
      name: "republishedAt",
      title: "Republished Date",
      type: "datetime",
    }),
    defineField({
      name: "attribution",
      title: "Attribution (shown on site)",
      type: "string",
      description: 'e.g. "Originally published in AARP Bulletin"',
    }),
    defineField({
      name: "rightsNote",
      title: "Rights Note (internal)",
      type: "text",
      rows: 2,
      description: "Internal note about permission or license — not shown on the website.",
    }),
  ],
});
