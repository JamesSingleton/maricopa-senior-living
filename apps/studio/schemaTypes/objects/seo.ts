import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "SEO Title",
      type: "string",
      description: "Overrides the page title in search results if set.",
    }),
    defineField({
      name: "description",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description: "Short description for search engines (recommended 50–160 characters).",
    }),
    defineField({
      name: "image",
      title: "Social Image",
      type: "image",
      description: "Image for social sharing (1200×630 recommended).",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Hide from search engines",
      type: "boolean",
      initialValue: false,
    }),
  ],
});

export const seoField = defineField({
  name: "seo",
  title: "SEO",
  type: "seo",
});
